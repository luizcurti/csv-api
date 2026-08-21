import { CreateDataUseCase } from './createDataUseCase';
import { Request, Response } from 'express';
import { dbDataRepository } from '@modules/data/repositories/dbDataRepository';

class CreateDataController {
  async handle(request: Request, response: Response) {
    const { product_code, quantity, pick_location } = request.body;

    const createDataUseCase = new CreateDataUseCase(dbDataRepository);

    const newProduct = await createDataUseCase.execute({
      product_code,
      quantity,
      pick_location,
    });

    return response.status(201).json(newProduct);
  }
}

export { CreateDataController };
