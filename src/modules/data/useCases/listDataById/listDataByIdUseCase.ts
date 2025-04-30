import { AppError } from '@errors/appError';
import { IRequest, IResponse } from './iListDataDTO';
import { IDataRepository } from '@modules/data/repositories/iDataRepository';

class ListDataByIdUseCase {
  constructor(
    private dataRepository: IDataRepository
  ) {}

  async execute({product_code}: IRequest): Promise<IResponse> {
    let data = await this.dataRepository.findByID(product_code);
  
    if (!data) 
      throw new AppError('Data does not exist', 404, 'Not Found');

    return data;
  }
}

export { ListDataByIdUseCase };
