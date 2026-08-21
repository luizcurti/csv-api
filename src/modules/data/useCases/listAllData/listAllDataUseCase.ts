import {
  IDataRepository,
  PaginatedResult,
  IData,
  PaginationOptions,
} from '@modules/data/repositories/iDataRepository';

class ListAllDataUseCase {
  constructor(private dataRepository: IDataRepository) {}

  async execute(options?: PaginationOptions): Promise<PaginatedResult<IData>> {
    return await this.dataRepository.findAll(options);
  }
}

export { ListAllDataUseCase };
