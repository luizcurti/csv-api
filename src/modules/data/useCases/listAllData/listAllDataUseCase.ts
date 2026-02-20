
import { IDataRepository, PaginatedResult, interfaceData, PaginationOptions } from '@modules/data/repositories/iDataRepository';

class ListAllDataUseCase {
  constructor(
    private dataRepository: IDataRepository
  ) {}

  async execute(options?: PaginationOptions): Promise<PaginatedResult<interfaceData>> {
    return await this.dataRepository.findAll(options);
  }
}

export { ListAllDataUseCase };
