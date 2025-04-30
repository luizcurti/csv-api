import { CreateDataUseCase } from '@modules/data/useCases/createData/createDataUseCase';
import { InMemoryLessonsRepository } from './InMemoryDataRepository';
import { ListAllDataUseCase } from '@modules/data/useCases/listAllData/listAllDataUseCase';

describe('CreateDataUseCase', () => {
  it('should list data', async () => {
    const inMemoryLessonsRepository = new InMemoryLessonsRepository()
    const createData = new CreateDataUseCase(inMemoryLessonsRepository);

    await createData.execute({ 
      product_code: '123456',
      quantity: '10',
      pick_location: 'A1'
    });

    await createData.execute({ 
      product_code: '785412',
      quantity: '7',
      pick_location: 'Z5'
    });

    await createData.execute({ 
      product_code: '36925814',
      quantity: '80',
      pick_location: 'G9'
    });

    const listData = new ListAllDataUseCase(inMemoryLessonsRepository);

    const data = await listData.execute();

    expect(data).toHaveLength(3);

    expect(data[0]).toHaveProperty('product_code');
    expect(data[1]).toHaveProperty('quantity');
    expect(data[2]).toHaveProperty('pick_location');
    expect(data[0].product_code).toBe('123456');
    expect(data[1].product_code).toBe('785412');    
    expect(data[2].product_code).toBe('36925814');
  });

  it('should list empty data', async () => {
    const inMemoryLessonsRepository = new InMemoryLessonsRepository()
    const listData = new ListAllDataUseCase(inMemoryLessonsRepository);

    const data = await listData.execute();

    expect(data).toHaveLength(0);
  });
});