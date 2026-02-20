import { ListAllDataUseCase } from './listAllDataUseCase';
import { Request, Response } from 'express';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';

class ListAllDataController {
  async handle(request: Request, response: Response) {
    const { limit, offset } = request.query;
    
    const dbDataRepository = new DBDataRepository();
    const listAllDataUseCase = new ListAllDataUseCase(dbDataRepository);

    const result = await listAllDataUseCase.execute({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });

    return response.status(200).json(result);
  }
}

export { ListAllDataController };
