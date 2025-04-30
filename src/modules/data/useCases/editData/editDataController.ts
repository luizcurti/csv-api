import { EditDataUseCase } from './editDataUseCase';
import { Request, Response } from 'express';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';

class EditDataController {
  async handle(request: Request, response: Response) {
    const { product_code } = request.params;
    const { quantity, pick_location } = request.body;

    const dbDataRepository = new DBDataRepository(); 
    const editDataUseCase = new EditDataUseCase(dbDataRepository);

    try {
      await editDataUseCase.execute({
        product_code: String(product_code),
        quantity: String(quantity),
        pick_location: String(pick_location)
      });

      return response.status(200).json({ message: 'Data updated successfully.' });
    } catch (error: any) {
      return response.status(500).json({
        error: 'Failed to update data.',
        details: error.message,
      });
    }
  }
}

export { EditDataController };
