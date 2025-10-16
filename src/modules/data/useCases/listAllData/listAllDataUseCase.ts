
import { IDataRepository, interfaceData } from '@modules/data/repositories/iDataRepository';

class ListAllDataUseCase {
  constructor(
    private dataRepository: IDataRepository
  ) {}

  async execute(): Promise<interfaceData[]> {
    return await this.dataRepository.findAll();
  }
}

export { ListAllDataUseCase };
