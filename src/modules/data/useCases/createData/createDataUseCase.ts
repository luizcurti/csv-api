import { AppError } from '@errors/appError';
import {
  IDataRepository,
  IData,
} from '@modules/data/repositories/iDataRepository';

class CreateDataUseCase {
  constructor(private dataRepository: IDataRepository) {}

  async execute({
    product_code,
    quantity,
    pick_location,
  }: {
    product_code: string;
    quantity: number;
    pick_location: string;
  }): Promise<IData> {
    try {
      const createData = await this.dataRepository.create({
        product_code,
        quantity,
        pick_location,
      });

      return createData;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'Failed to create data',
        500,
        'Internal Server Error',
        error
      );
    }
  }
}

export { CreateDataUseCase };
