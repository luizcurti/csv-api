import { AppError } from '@errors/appError';
import { IRequest } from './iEditDataDTO';
import { IDataRepository, interfaceData } from '@modules/data/repositories/iDataRepository';

class EditDataUseCase {
  constructor(
    private dataRepository: IDataRepository
  ) {}

  async execute({      
    product_code,
    quantity,
    pick_location  
  }: IRequest): Promise<interfaceData> {
    const data = await this.dataRepository.findByID(product_code);

    if (!data) 
      throw new AppError('Data does not exist', 404, 'Not Found');

    data.quantity = quantity;
    data.pick_location = pick_location;

    const dataUpdated = await this.dataRepository.update(data);

    return dataUpdated;
  }
}

export { EditDataUseCase };
