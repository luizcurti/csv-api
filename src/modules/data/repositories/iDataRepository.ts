export interface interfaceData {
  product_code: string;
  quantity: string;
  pick_location: string;
}

export interface IDataRepository {
  create(data: interfaceData): Promise<interfaceData>;
  findByID(product_code: string): Promise<interfaceData>;
  findAll(): Promise<interfaceData[]>
  update(data: interfaceData): Promise<interfaceData>;
  remove(product_code: string): Promise<void>;
}