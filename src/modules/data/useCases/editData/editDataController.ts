import { EditDataUseCase } from './editDataUseCase';
import { Request, Response } from 'express';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';

class EditDataController {
  async handle(request: Request, response: Response) {
    const { product_code } = request.params;
    const { quantity, pick_location } = request.body;

    const dbDataRepository = new DBDataRepository();
    const editDataUseCase = new EditDataUseCase(dbDataRepository);

    const dataUpdated = await editDataUseCase.execute({
      product_code,
      quantity,
      pick_location,
    });

    return response.status(200).json(dataUpdated);
  }
}

export { EditDataController };
