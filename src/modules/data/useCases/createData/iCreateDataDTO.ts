export interface IRequest {
  product_code: string;
  quantity: number;
  pick_location: string;
}

export interface IResponse {
  message: string;
  data?: any;
}
