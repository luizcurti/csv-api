import fs from 'fs';
import { Mutex } from 'async-mutex';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { IDataRepository, IData } from './iDataRepository';
import { AppError } from '@errors/appError';
import { sanitizeForCSV } from '@shared/utils/csvSanitizer';
import { logger } from '@shared/utils/logger';
import { env } from '@config/env';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type RawCSVRecord = Record<string, string>;

function toIData(record: RawCSVRecord): IData {
  return {
    ...record,
    quantity: Number(record.quantity) || 0,
  } as unknown as IData;
}

export class DBDataRepository implements IDataRepository {
  private readonly csvFilePath: string;

  private readonly writeLock = new Mutex();

  private dataCache: Map<string, IData> | null = null;
  private lastCacheUpdate: number = 0;
  private readonly CACHE_TTL = 5000; // 5 seconds

  constructor(csvFilePath: string = env.csvFilePath) {
    this.csvFilePath = csvFilePath;
  }

  private isCacheValid(): boolean {
    return (
      this.dataCache !== null &&
      Date.now() - this.lastCacheUpdate < this.CACHE_TTL
    );
  }

  private buildCache(data: IData[]): void {
    this.dataCache = new Map(data.map((item) => [item.product_code, item]));
    this.lastCacheUpdate = Date.now();
    logger.debug('Cache built', { itemCount: data.length });
  }

  private invalidateCache(): void {
    this.dataCache = null;
    logger.debug('Cache invalidated');
  }

  private readCSV(): IData[] {
    if (!fs.existsSync(this.csvFilePath)) {
      logger.warn('CSV file does not exist', { path: this.csvFilePath });
      return [];
    }

    // File size validation
    const stats = fs.statSync(this.csvFilePath);
    if (stats.size > MAX_FILE_SIZE) {
      logger.error('CSV file exceeds maximum size', {
        size: stats.size,
        maxSize: MAX_FILE_SIZE,
      });
      throw new AppError(
        `CSV file is too large (${(stats.size / 1024 / 1024).toFixed(2)}MB). Maximum allowed is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        413,
        'Payload Too Large'
      );
    }

    const fileContent = fs.readFileSync(this.csvFilePath, 'utf-8');

    try {
      const records: RawCSVRecord[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: false, // Strict mode
      });

      return records.map(toIData);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (message.includes('column')) {
        logger.warn('CSV has inconsistent column count', {
          error: message,
          file: this.csvFilePath,
        });

        // Fallback with relax_column_count in case of error
        const records: RawCSVRecord[] = parse(fileContent, {
          columns: true,
          skip_empty_lines: true,
          relax_column_count: true,
        });

        return records.map(toIData);
      }
      throw error;
    }
  }

  private writeCSV(data: IData[]): void {
    const sortedData = data.sort((a, b) =>
      a.pick_location.localeCompare(b.pick_location)
    );
    const csv = stringify(sortedData, { header: true });
    fs.writeFileSync(this.csvFilePath, csv);
    this.invalidateCache();
    logger.info('CSV file updated', { recordCount: data.length });
  }

  async create(data: IData): Promise<IData> {
    return this.writeLock.runExclusive(async () => {
      const allData = this.readCSV();

      const sanitizedData = {
        ...data,
        product_code: sanitizeForCSV(data.product_code),
        pick_location: sanitizeForCSV(data.pick_location),
      };

      const index = allData.findIndex(
        (item) => item.product_code === sanitizedData.product_code
      );

      if (index !== -1) {
        logger.warn('Attempted to create duplicate product', {
          product_code: sanitizedData.product_code,
        });
        throw new AppError(
          `Product with code '${sanitizedData.product_code}' already exists`,
          409,
          'Conflict'
        );
      }

      allData.push(sanitizedData);
      this.writeCSV(allData);
      logger.info('Product created', {
        product_code: sanitizedData.product_code,
      });
      return sanitizedData;
    });
  }

  async findByID(product_code: string): Promise<IData> {
    // Use cache if available
    if (this.isCacheValid() && this.dataCache) {
      const item = this.dataCache.get(product_code);
      if (item) {
        logger.debug('Product found in cache', { product_code });
        return item;
      }
      logger.debug('Product not found in cache', { product_code });
      throw new AppError(
        `Product with code '${product_code}' not found`,
        404,
        'Not Found'
      );
    }

    const allData = this.readCSV();
    this.buildCache(allData);

    const item = allData.find((d) => d.product_code === product_code);

    if (!item) {
      logger.warn('Product not found', { product_code });
      throw new AppError(
        `Product with code '${product_code}' not found`,
        404,
        'Not Found'
      );
    }
    return item;
  }

  async findAll(options?: { limit?: number; offset?: number }): Promise<{
    data: IData[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
  }> {
    const allData = this.readCSV();

    if (!this.isCacheValid()) {
      this.buildCache(allData);
    }

    const total = allData.length;
    const limit = options?.limit || 100;
    const offset = options?.offset || 0;

    const paginatedData = allData.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    logger.debug('Products listed', { total, limit, offset });

    return {
      data: paginatedData,
      pagination: {
        total,
        limit,
        offset,
        hasMore,
      },
    };
  }

  async update(data: IData): Promise<IData> {
    return this.writeLock.runExclusive(async () => {
      const allData = this.readCSV();

      const sanitizedData = {
        ...data,
        product_code: sanitizeForCSV(data.product_code),
        pick_location: sanitizeForCSV(data.pick_location),
      };

      const index = allData.findIndex(
        (d) => d.product_code === sanitizedData.product_code
      );

      if (index === -1) {
        logger.warn('Attempted to update non-existent product', {
          product_code: sanitizedData.product_code,
        });
        throw new AppError(
          `Product with code '${sanitizedData.product_code}' not found`,
          404,
          'Not Found'
        );
      }

      allData[index] = sanitizedData;
      this.writeCSV(allData);
      logger.info('Product updated', {
        product_code: sanitizedData.product_code,
      });

      return sanitizedData;
    });
  }

  async remove(product_code: string): Promise<void> {
    return this.writeLock.runExclusive(async () => {
      const allData = this.readCSV();
      const filteredData = allData.filter(
        (d) => d.product_code !== product_code
      );

      if (filteredData.length === allData.length) {
        logger.warn('Attempted to delete non-existent product', {
          product_code,
        });
        throw new AppError(
          `Product with code '${product_code}' not found`,
          404,
          'Not Found'
        );
      }

      this.writeCSV(filteredData);
      logger.info('Product deleted', { product_code });
    });
  }
}

export const dbDataRepository = new DBDataRepository();
