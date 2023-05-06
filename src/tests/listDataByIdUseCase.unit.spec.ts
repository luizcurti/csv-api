import { CreateDataUseCase } from '@modules/data/useCases/createData/createDataUseCase';
import { InMemoryLessonsRepository } from './InMemoryDataRepository';
import { ListDataByIdUseCase } from '@modules/data/useCases/listDataById/listDataByIdUseCase';
import { AppError } from '@errors/appError';

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

    const listData = new ListDataByIdUseCase(inMemoryLessonsRepository);

    const dataList = await listData.execute({
      product_code: '785412'
    });

    expect(dataList).toHaveProperty('product_code');
    expect(dataList).toHaveProperty('quantity');
    expect(dataList).toHaveProperty('pick_location');
    expect(dataList.product_code).toBe('785412');
    expect(dataList.quantity).toBe('7');
    expect(dataList.pick_location).toBe('Z5');
  });

  it('should not remove a new data', async () => {
    const inMemoryLessonsRepository = new InMemoryLessonsRepository()
    const listData = new ListDataByIdUseCase(inMemoryLessonsRepository);

    await expect(listData.execute({
      product_code: '785412'
    })).rejects.toEqual(
      new AppError('Data does not exist', 404, 'Not Found')
    );
  });
});