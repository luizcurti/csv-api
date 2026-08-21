import { dbDataRepository } from '@modules/data/repositories/dbDataRepository';
import { ListDataByIdUseCase } from './listDataByIdUseCase';
import { Request, Response } from 'express';

class ListDataByIdController {
  async handle(request: Request, response: Response) {
    const { product_code } = request.params;

    const listDataByIdUseCase = new ListDataByIdUseCase(dbDataRepository);

    const listData = await listDataByIdUseCase.execute({
      product_code,
    });

    return response.status(200).json(listData);
  }
}

export { ListDataByIdController };
