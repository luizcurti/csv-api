import { AppError } from '@errors/appError';
import { IRequest } from './iCreateDataDTO';
import { IDataRepository, interfaceData } from '@modules/data/repositories/iDataRepository';

class CreateDataUseCase {
  constructor(
    private dataRepository: IDataRepository
  ) {}

    async execute({      
      product_code,
      quantity,
      pick_location  
    }: IRequest): Promise<interfaceData> {

    let data = await this.dataRepository.findByID(product_code);

    if (data) 
      throw new AppError('Data exist', 404, 'Not Found');

    const createData = await this.dataRepository.create({      
      product_code,
      quantity,
      pick_location  
    });

    return createData;
  }
}

export { CreateDataUseCase };
