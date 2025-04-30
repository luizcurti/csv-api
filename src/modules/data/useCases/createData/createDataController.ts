import { CreateDataUseCase } from './createDataUseCase';
import { Request, Response } from 'express';
import { AppError } from '@errors/appError';
import * as Yup from 'yup';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';

class CreateDataController {
  async handle(request: Request, response: Response) {
    const { product_code, quantity, pick_location } = request.body;

    const schema = Yup.object({
      product_code: Yup.string().required(),
      quantity: Yup.string().required(),
      pick_location: Yup.string().required()
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      throw new AppError('Validation failed', 400, 'VALIDATION_FAILED');
    }

    const dbDataRepository = new DBDataRepository();
    const createDataUseCase = new CreateDataUseCase(dbDataRepository);

    try {
      const newProduct = await createDataUseCase.execute({
        product_code: String(product_code),
        quantity: String(quantity),
        pick_location: String(pick_location)
      });

      return response.status(201).json(newProduct);
    } catch (error) {

      console.error(error); 
      
      if (error instanceof AppError) {
        return response.status(error.code).json({
          message: error.message,
          type: error.type,
          data: error.data
        });
      }

      return response.status(500).json({
        message: 'Unexpected error occurred'
      });
    }
  }
}

export { CreateDataController };
