
import { IDataRepository } from '@modules/data/repositories/iDataRepository';

import { IResponse } from '../createData/iCreateDataDTO';

class ListAllDataUseCase {
  constructor(

    private dataRepository: IDataRepository
  ) {}

  async execute(): Promise<IResponse[]> {
    return await this.dataRepository.findAll();
  }
}

export { ListAllDataUseCase };
