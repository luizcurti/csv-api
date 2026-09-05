import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';
import { AppError } from '@errors/appError';
import { logger } from '@shared/utils/logger';

jest.mock('fs');
// Wrap the real implementation so every existing test keeps parsing for
// real, while one test below can override a single call to simulate a
// non-Error throwable from the dependency.
jest.mock('csv-parse/sync', () => {
  const actual: typeof import('csv-parse/sync') =
    jest.requireActual('csv-parse/sync');
  return { ...actual, parse: jest.fn(actual.parse) };
});

const mockedParse = parse as jest.Mock;

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('DBDataRepository', () => {
  let repository: DBDataRepository;

  const mockData = [
    {
      product_code: '123456',
      quantity: 10,
      pick_location: 'A1',
    },
    {
      product_code: '789012',
      quantity: 5,
      pick_location: 'B2',
    },
  ];

  const mockCsvContent = `product_code,quantity,pick_location
123456,10,A1
789012,5,B2`;

  beforeEach(() => {
    repository = new DBDataRepository();
    jest.clearAllMocks();

    // Mock fs.statSync to return a valid file size
    mockedFs.statSync.mockReturnValue({
      size: 1024, // 1KB
    } as fs.Stats);
  });

  describe('findAll', () => {
    it('should return all data from CSV file', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);

      const result = await repository.findAll();

      expect(result.data).toEqual(mockData);
      expect(result.pagination.total).toBe(2);
      expect(result.pagination.limit).toBe(100);
      expect(result.pagination.offset).toBe(0);
      expect(result.pagination.hasMore).toBe(false);
      expect(mockedFs.existsSync).toHaveBeenCalled();
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(
        expect.any(String),
        'utf-8'
      );
    });

    it('should return empty array when CSV file does not exist', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      const result = await repository.findAll();

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
      expect(mockedFs.existsSync).toHaveBeenCalled();
      expect(mockedFs.readFileSync).not.toHaveBeenCalled();
    });

    it('should return empty array when CSV file is empty', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('');

      const result = await repository.findAll();

      expect(result.data).toEqual([]);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('findByID', () => {
    it('should return data by product_code', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);

      const result = await repository.findByID('123456');

      expect(result).toEqual(mockData[0]);
    });

    it('should throw error when product not found', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);

      await expect(repository.findByID('999999')).rejects.toThrow(
        "Product with code '999999' not found"
      );
    });

    it('should throw error when CSV file is empty', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await expect(repository.findByID('123456')).rejects.toThrow(
        "Product with code '123456' not found"
      );
    });
  });

  describe('create', () => {
    const newData = {
      product_code: '555555',
      quantity: 15,
      pick_location: 'C3',
    };

    it('should create new data when product does not exist', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);
      mockedFs.writeFileSync.mockImplementation(() => {});

      const result = await repository.create(newData);

      expect(result).toEqual(newData);
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('555555,15,C3')
      );
    });

    it('should throw AppError when product already exists', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);

      const existingData = {
        product_code: '123456',
        quantity: 20,
        pick_location: 'D4',
      };

      await expect(repository.create(existingData)).rejects.toThrow(
        new AppError(
          "Product with code '123456' already exists",
          409,
          'Conflict'
        )
      );
      expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should create data when CSV file does not exist', async () => {
      mockedFs.existsSync.mockReturnValue(false);
      mockedFs.writeFileSync.mockImplementation(() => {});

      const result = await repository.create(newData);

      expect(result).toEqual(newData);
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('555555,15,C3')
      );
    });
  });

  describe('update', () => {
    const updatedData = {
      product_code: '123456',
      quantity: 25,
      pick_location: 'D4',
    };

    it('should update existing data', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);
      mockedFs.writeFileSync.mockImplementation(() => {});

      const result = await repository.update(updatedData);

      expect(result).toEqual(updatedData);
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('123456,25,D4')
      );
    });

    it('should throw error when product not found', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);

      const nonExistentData = {
        product_code: '999999',
        quantity: 25,
        pick_location: 'D4',
      };

      await expect(repository.update(nonExistentData)).rejects.toThrow(
        "Product with code '999999' not found"
      );
      expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should throw error when CSV file is empty', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await expect(repository.update(updatedData)).rejects.toThrow(
        "Product with code '123456' not found"
      );
    });
  });

  describe('remove', () => {
    it('should remove existing data', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);
      mockedFs.writeFileSync.mockImplementation(() => {});

      await repository.remove('123456');

      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.not.stringContaining('123456')
      );
    });

    it('should throw error when product not found', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);

      await expect(repository.remove('999999')).rejects.toThrow(
        "Product with code '999999' not found"
      );
      expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should throw error when CSV file is empty', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await expect(repository.remove('123456')).rejects.toThrow(
        "Product with code '123456' not found"
      );
    });
  });

  describe('error handling', () => {
    it('should handle file system errors gracefully', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockImplementation(() => {
        throw new Error('File system error');
      });

      await expect(repository.findAll()).rejects.toThrow('File system error');
    });

    it('should handle malformed CSV content', async () => {
      const malformedCsv = 'invalid,csv,content\nwith,wrong,number,of,columns';

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(malformedCsv);

      const result = await repository.findAll();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination).toBeDefined();
    });

    it('should rethrow parse errors unrelated to column count', async () => {
      const unclosedQuoteCsv =
        'product_code,quantity,pick_location\n"unterminated,10,A1';

      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(unclosedQuoteCsv);

      await expect(repository.findAll()).rejects.toThrow('Quote Not Closed');
    });

    it('should stringify a non-Error value thrown by the CSV parser', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);
      mockedParse.mockImplementationOnce(() => {
        // Simulate a dependency that throws a non-Error value.
        throw 'raw parser failure';
      });

      await expect(repository.findAll()).rejects.toBe('raw parser failure');
    });

    it('should throw AppError when the CSV file exceeds the maximum size', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.statSync.mockReturnValue({
        size: 11 * 1024 * 1024, // 11MB, over the 10MB limit
      } as fs.Stats);

      await expect(repository.findAll()).rejects.toThrow(
        'CSV file is too large'
      );
      expect(mockedFs.readFileSync).not.toHaveBeenCalled();
    });
  });

  describe('cache', () => {
    it('should throw when a product is missing from a warm cache', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);

      // Warm the cache with the current data set.
      await repository.findAll();

      await expect(repository.findByID('does-not-exist')).rejects.toThrow(
        "Product with code 'does-not-exist' not found"
      );
      // The cached path should not re-read the file from disk.
      expect(mockedFs.readFileSync).toHaveBeenCalledTimes(1);
    });

    it('should not rebuild the cache when findAll is called again within the TTL', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);
      const debugSpy = jest.spyOn(logger, 'debug');

      await repository.findAll();
      expect(debugSpy).toHaveBeenCalledWith('Cache built', expect.any(Object));

      debugSpy.mockClear();
      await repository.findAll();

      expect(debugSpy).not.toHaveBeenCalledWith(
        'Cache built',
        expect.any(Object)
      );
    });
  });
});
