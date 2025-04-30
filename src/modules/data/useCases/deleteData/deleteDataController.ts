import { DeleteDataUseCase } from './deleteDataUseCase';
import { Request, Response } from 'express';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';

class DeleteDataController {
  async handle(request: Request, response: Response) {
    const { product_code } = request.params;

    const dbDataRepository = new DBDataRepository(); 
    const deleteDataUseCase = new DeleteDataUseCase(dbDataRepository);

    try {
      await deleteDataUseCase.execute({
        product_code: String(product_code),
      });

      return response.status(200).json({ message: 'Data deleted successfully.' });
    } catch (error: any) {
      if (error.statusCode === 404) {
        return response.status(404).json({
          error: 'Data not found.',
          details: error.message,
        });
      }

      return response.status(500).json({
        error: 'Failed to delete data.',
        details: error.message,
      });
    }
  }
}

export { DeleteDataController };
