import { DeleteDataUseCase } from './deleteDataUseCase';
import { Request, Response } from 'express';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';

class DeleteDataController {
  async handle(request: Request, response: Response) {
    const { product_code } = request.params;

    const dbDataRepository = new DBDataRepository();
    const deleteDataUseCase = new DeleteDataUseCase(dbDataRepository);

    await deleteDataUseCase.execute({
      product_code,
    });

    return response.status(200).json({ message: 'Data deleted successfully.' });
  }
}

export { DeleteDataController };
