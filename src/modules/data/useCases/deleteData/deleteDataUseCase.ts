import { AppError } from '@errors/appError';
import { IRequest } from './iDeleteDataDTO';
import { IDataRepository } from '@modules/data/repositories/iDataRepository';

class DeleteDataUseCase {
  constructor(
    private dataRepository: IDataRepository
  ) {}

  async execute({product_code}: IRequest): Promise<string>{
    const data = await this.dataRepository.findByID(product_code);

    if (!data) 
      throw new AppError('Data does not exist', 404, 'Not Found');

    await this.dataRepository.remove(product_code);

    return "Deleted";
  }
}

export { DeleteDataUseCase };
