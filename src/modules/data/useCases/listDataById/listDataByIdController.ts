import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';
import { ListDataByIdUseCase } from './listDataByIdUseCase';
import { Request, Response } from 'express';

class ListDataByIdController {
  async handle(request: Request, response: Response) {
    const { product_code } = request.params;

    const dbDataRepository = new DBDataRepository(); 
    const listDataByIdUseCase = new ListDataByIdUseCase(dbDataRepository);

    try {
      const listData = await listDataByIdUseCase.execute({
        product_code: String(product_code),
      });
      return response.status(200).json(listData);
    } catch (error: any) {
      if (error.message === 'Product not found.') {
        return response.status(404).json({ error: 'Product not found.' });
      }

      return response.status(500).json({
        error: 'Internal server error',
        details: error.message,
      });
    }
  }
}

export { ListDataByIdController };
