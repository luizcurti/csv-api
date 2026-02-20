import fs from 'fs';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';
import { AppError } from '@errors/appError';

jest.mock('fs');

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('DBDataRepository', () => {
  let repository: DBDataRepository;
  
  const mockData = [
    {
      product_code: '123456',
      quantity: 10,
      pick_location: 'A1'
    },
    {
      product_code: '789012',
      quantity: 5,
      pick_location: 'B2'
    }
  ];

  const mockCsvContent = `product_code,quantity,pick_location
123456,10,A1
789012,5,B2`;

  beforeEach(() => {
    repository = new DBDataRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all data from CSV file', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(mockCsvContent);

      const result = await repository.findAll();

      expect(result).toEqual(mockData);
      expect(mockedFs.existsSync).toHaveBeenCalled();
      expect(mockedFs.readFileSync).toHaveBeenCalledWith(expect.any(String), 'utf-8');
    });

    it('should return empty array when CSV file does not exist', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(mockedFs.existsSync).toHaveBeenCalled();
      expect(mockedFs.readFileSync).not.toHaveBeenCalled();
    });

    it('should return empty array when CSV file is empty', async () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('');

      const result = await repository.findAll();

      expect(result).toEqual([]);
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

      await expect(repository.findByID('999999')).rejects.toThrow('Product not found');
    });

    it('should throw error when CSV file is empty', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await expect(repository.findByID('123456')).rejects.toThrow('Product not found');
    });
  });

  describe('create', () => {
    const newData = {
      product_code: '555555',
      quantity: 15,
      pick_location: 'C3'
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
        pick_location: 'D4'
      };

      await expect(repository.create(existingData)).rejects.toThrow(
        new AppError('Product already exists', 409, 'Conflict')
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
      pick_location: 'D4'
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
        pick_location: 'D4'
      };

      await expect(repository.update(nonExistentData)).rejects.toThrow('Product not found');
      expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should throw error when CSV file is empty', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await expect(repository.update(updatedData)).rejects.toThrow('Product not found');
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

      await expect(repository.remove('999999')).rejects.toThrow('Product not found');
      expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
    });

    it('should throw error when CSV file is empty', async () => {
      mockedFs.existsSync.mockReturnValue(false);

      await expect(repository.remove('123456')).rejects.toThrow('Product not found');
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
      expect(Array.isArray(result)).toBe(true);
    });
  });
});