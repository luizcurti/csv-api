import { ListAllDataUseCase } from './listAllDataUseCase';
import { Request, Response } from 'express';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';

class ListAllDataController {
  async handle(request: Request, response: Response) {
    const dbDataRepository = new DBDataRepository();
    const listAllDataUseCase = new ListAllDataUseCase(dbDataRepository);

    try {
      const listDatas = await listAllDataUseCase.execute();
      return response.status(200).json(listDatas);
    } catch (error: any) {
      return response.status(500).json({
        error: 'Failed to retrieve data.',
        details: error.message,
      });
    }
  }
}

export { ListAllDataController };
