import { AppError } from '@errors/appError';
import { IRequest } from './iDeleteDataDTO';
import { IDataRepository } from '@modules/data/repositories/iDataRepository';

class DeleteDataUseCase {
  constructor(
    private dataRepository: IDataRepository
  ) {}

  async execute({product_code}: IRequest): Promise<string>{
    await this.dataRepository.remove(product_code);

    return "Deleted";
  }
}

export { DeleteDataUseCase };
