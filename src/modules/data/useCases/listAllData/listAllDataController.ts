import { ListAllDataUseCase } from './listAllDataUseCase';
import { Request, Response } from 'express';
import { DBDataRepository } from "@modules/data/repositories/db/dbDataRepository";

class ListAllDataController {
  async handle(request: Request, response: Response) {

    const dbDataRepository = new DBDataRepository(); 
    const listAllDataUseCase = new ListAllDataUseCase(dbDataRepository);

    const listDatas = await listAllDataUseCase.execute();
    return response.status(200).json(listDatas);
  }
}

export { ListAllDataController };
