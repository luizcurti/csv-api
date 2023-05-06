
import { CreateDataUseCase } from './createDataUseCase';
import { Request, Response } from 'express';
import { AppError } from '@errors/appError';
import * as Yup from 'yup';
import { DBDataRepository } from '@modules/data/repositories/db/dbDataRepository';

class CreateDataController {
  async handle(request: Request, response: Response) {
    const {    
      product_code,
      quantity,
      pick_location  
    } = request.body;

    const schema = Yup.object({
      product_code: Yup.string().required(),
      quantity: Yup.number().required(),
      pick_location: Yup.string().required()
    });

    const validation = await schema.validate(request.body);

    if (!validation)
      throw new AppError('Validations failed', 400, 'VALIDATIONS_FAILED');

    const dbDataRepository = new DBDataRepository(); 
    const createDataUseCase = new CreateDataUseCase(dbDataRepository);

    await createDataUseCase.execute({
      product_code: String(product_code),
      quantity: String(quantity),
      pick_location: String(pick_location)  
    });
    return response.status(200).json({ message: 'Data created successfully' });
  }
}

export { CreateDataController };
