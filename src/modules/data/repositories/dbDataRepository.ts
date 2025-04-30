import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { IDataRepository, interfaceData } from './iDataRepository';
import { AppError } from '@errors/appError';

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

    return records as interfaceData[];
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
    const index = allData.findIndex(item => item.product_code === data.product_code);

    if (index !== -1) {
      throw new AppError('Data exist', 404, 'Not Found');
    } else {
      allData.push(data);
      this.writeCSV(allData);
      return data;
    }
  }

  async findByID(product_code: string): Promise<interfaceData> {
    const allData = this.readCSV();
    const item = allData.find(d => d.product_code === product_code);

    if (!item) throw new Error('Product not found.');
    return item;
  }

  async findAll(): Promise<interfaceData[]> {
    return this.readCSV();
  }

  async update(data: interfaceData): Promise<interfaceData> {
    const allData = this.readCSV();
    const index = allData.findIndex(d => d.product_code === data.product_code);

    if (index === -1) throw new Error('Product not found.');

    allData[index] = data;
    this.writeCSV(allData);

    return data;
  }

  async remove(product_code: string): Promise<void> {
    const allData = this.readCSV();
    const filteredData = allData.filter(d => d.product_code !== product_code);

    if (filteredData.length === allData.length) {
      throw new Error('Product not found.');
    }

    this.writeCSV(filteredData);
  }
}
