import { CreateDataUseCase } from '@modules/data/useCases/createData/createDataUseCase';
import { InMemoryLessonsRepository } from './InMemoryDataRepository';
import { AppError } from '@errors/appError';

describe('CreateDataUseCase', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new data', async () => {
    const inMemoryLessonsRepositoryCreate = new InMemoryLessonsRepository()
    const useCase = new CreateDataUseCase(inMemoryLessonsRepositoryCreate);

    const dataCreate = await useCase.execute({ 
      product_code: '123456',
      quantity: '10',
      pick_location: 'A1'
    });

    expect(dataCreate).toHaveProperty('product_code');
    expect(dataCreate).toHaveProperty('quantity');
    expect(dataCreate).toHaveProperty('pick_location');

    expect(dataCreate.product_code).toBe('123456');
    expect(dataCreate.quantity).toBe('10');
    expect(dataCreate.pick_location).toBe('A1');
  });

  it('should not create a new data', async () => {
    const inMemoryLessonsRepositoryCreate = new InMemoryLessonsRepository()
    const useCase = new CreateDataUseCase(inMemoryLessonsRepositoryCreate);

    await useCase.execute({ 
      product_code: '123456',
      quantity: '10',
      pick_location: 'A1'
    });

    await expect(useCase.execute({ 
      product_code: '123456',
      quantity: '10',
      pick_location: 'A1'
    })).rejects.toEqual(
      new AppError('Data exist', 404, 'Not Found')
    );
  });
});