import { interfaceData, IDataRepository } from '@modules/data/repositories/iDataRepository';
import { AppError } from '@errors/appError';

export class InMemoryLessonsRepository implements IDataRepository {
  public items: interfaceData[] = [];

  async create(data: interfaceData): Promise<interfaceData>{
    const exists = this.items.find((item) => item.product_code === data.product_code);
    if (exists) {
      throw new AppError('Product already exists', 409, 'Conflict');
    }

    this.items.push({
      product_code: data.product_code,
      quantity: data.quantity,
      pick_location: data.pick_location
    })

    return data;
  }

  async findByID(product_code: string) {
    const item = this.items.find((item) => item.product_code === product_code);
    if (!item) {
      throw new AppError('Product not found', 404, 'Not Found');
    }
    return item;
  } 

  async findAll(options?: { limit?: number; offset?: number }) {
    const total = this.items.length;
    const limit = options?.limit || 100;
    const offset = options?.offset || 0;
    
    const paginatedData = this.items.slice(offset, offset + limit);
    const hasMore = offset + limit < total;
    
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

  async update(data: interfaceData) {  
    const dataUpdate = this.items.find((item) => item.product_code === data.product_code);
    if (!dataUpdate) {
      throw new AppError('Product not found', 404, 'Not Found');
    }
    Object.assign(dataUpdate, data);

    return data
  }

  async remove(product_code: string) {  
    const dataUpdate = this.items.find((item) => item.product_code === product_code);
    if (!dataUpdate) {
      throw new AppError('Product not found', 404, 'Not Found');
    }
    this.items.splice(this.items.indexOf(dataUpdate), 1);
  }
}
