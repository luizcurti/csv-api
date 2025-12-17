import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { IDataRepository, interfaceData } from './iDataRepository';
import { AppError } from '@errors/appError';
import { sanitizeForCSV } from '@shared/utils/csvSanitizer';

const csvFilePath = path.resolve(__dirname, '../../../../csv/data.csv');

export class DBDataRepository implements IDataRepository {
  private readCSV(): interfaceData[] {
    if (!fs.existsSync(csvFilePath)) return [];

    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
    });

    return records.map((record: any) => ({
      ...record,
      quantity: Number(record.quantity) || 0,
    })) as interfaceData[];
  }

  private writeCSV(data: interfaceData[]): void {
    const sortedData = data.sort((a, b) =>
      a.pick_location.localeCompare(b.pick_location)
    );
    const csv = stringify(sortedData, { header: true });
    fs.writeFileSync(csvFilePath, csv);
  }

  async create(data: interfaceData): Promise<interfaceData> {
    const allData = this.readCSV();

    const sanitizedData = {
      ...data,
      product_code: sanitizeForCSV(data.product_code),
      pick_location: sanitizeForCSV(data.pick_location),
    };

    const index = allData.findIndex(
      item => item.product_code === sanitizedData.product_code
    );

    if (index !== -1) {
      throw new AppError('Product already exists', 409, 'Conflict');
    }

    allData.push(sanitizedData);
    this.writeCSV(allData);
    return sanitizedData;
  }

  async findByID(product_code: string): Promise<interfaceData> {
    const allData = this.readCSV();
    const item = allData.find(d => d.product_code === product_code);

    if (!item) {
      throw new AppError('Product not found', 404, 'Not Found');
    }
    return item;
  }

  async findAll(): Promise<interfaceData[]> {
    return this.readCSV();
  }

  async update(data: interfaceData): Promise<interfaceData> {
    const allData = this.readCSV();

    const sanitizedData = {
      ...data,
      product_code: sanitizeForCSV(data.product_code),
      pick_location: sanitizeForCSV(data.pick_location),
    };

    const index = allData.findIndex(d => d.product_code === sanitizedData.product_code);

    if (index === -1) {
      throw new AppError('Product not found', 404, 'Not Found');
    }

    allData[index] = sanitizedData;
    this.writeCSV(allData);

    return sanitizedData;
  }

  async remove(product_code: string): Promise<void> {
    const allData = this.readCSV();
    const filteredData = allData.filter(d => d.product_code !== product_code);

    if (filteredData.length === allData.length) {
      throw new AppError('Product not found', 404, 'Not Found');
    }

    this.writeCSV(filteredData);
  }
}
