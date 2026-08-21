export interface IData {
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
  create(data: IData): Promise<IData>;
  findByID(product_code: string): Promise<IData>;
  findAll(options?: PaginationOptions): Promise<PaginatedResult<IData>>;
  update(data: IData): Promise<IData>;
  remove(product_code: string): Promise<void>;
}
