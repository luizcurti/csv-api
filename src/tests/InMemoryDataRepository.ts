import { interfaceData, IDataRepository } from '@modules/data/repositories/iDataRepository';

export class InMemoryLessonsRepository implements IDataRepository {
  public items: interfaceData[] = [];

  async create(data: interfaceData): Promise<interfaceData>{
    this.items.push({
      product_code: data.product_code,
      quantity: data.quantity,
      pick_location: data.pick_location
    })

    return data;
  }

  async findByID(product_code: string) {
    return this.items.find((item) => item.product_code === product_code);
  } 

  async findAll() {
    return await this.items;
  }

  async update(data: interfaceData) {  
    const dataUpdate = this.items.find((item) => item.product_code === data.product_code);
    Object.assign(dataUpdate, data);

    return data
  }

  async remove(product_code: string) {  
    const dataUpdate = this.items.find((item) => item.product_code === product_code);
    this.items.splice(this.items.indexOf(dataUpdate), 1);
  }
}
