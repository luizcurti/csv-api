export interface interfaceData {
  product_code: string;
  quantity: number;
  pick_location: string;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface IDataRepository {
  create(data: interfaceData): Promise<interfaceData>;
  findByID(product_code: string): Promise<interfaceData>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<interfaceData>>;
  update(data: interfaceData): Promise<interfaceData>;
  remove(product_code: string): Promise<void>;
}