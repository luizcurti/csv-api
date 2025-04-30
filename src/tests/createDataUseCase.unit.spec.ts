import { CreateDataUseCase } from '@modules/data/useCases/createData/createDataUseCase';
import { InMemoryLessonsRepository } from './InMemoryDataRepository';
import { AppError } from '@errors/appError';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';

describe('CreateDataUseCase', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new data', async () => {
    const inMemoryLessonsRepositoryCreate = new InMemoryLessonsRepository();
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

  it('should not create a new data when data already exists', async () => {
    const dbDataRepository = new DBDataRepository();
    const useCase = new CreateDataUseCase(dbDataRepository);
  
    // Criação inicial de dados
    await useCase.execute({ 
      product_code: '123456',
      quantity: '10',
      pick_location: 'A1'
    });
  
    // Tentativa de criar o mesmo dado novamente, deve falhar
    await expect(useCase.execute({ 
      product_code: '123456',
      quantity: '10',
      pick_location: 'A1'
    })).rejects.toThrowError(new AppError('Data exist', 404, 'Not Found'));
  });
  

  it('should throw an error if the repository throws an error', async () => {
    const dbDataRepository = new DBDataRepository();
    const useCase = new CreateDataUseCase(dbDataRepository);
  
    // Simulando um erro no repositório, por exemplo, erro de validação de produto duplicado
    jest.spyOn(dbDataRepository, 'create').mockImplementationOnce(() => {
      throw new AppError('Data exist', 404, 'Not Found');
    });
  
    await expect(useCase.execute({ 
      product_code: '123456',
      quantity: '10',
      pick_location: 'A1'
    })).rejects.toThrowError(new AppError('Data exist', 404, 'Not Found'));
  });
  
  it('should handle unexpected errors properly', async () => {
    const dbDataRepository = new DBDataRepository();
    const useCase = new CreateDataUseCase(dbDataRepository);
  
    // Simulando um erro inesperado no repositório
    jest.spyOn(dbDataRepository, 'create').mockImplementationOnce(() => {
      throw new Error('Unexpected error');
    });
  
    await expect(useCase.execute({ 
      product_code: '123456',
      quantity: '10',
      pick_location: 'A1'
    })).rejects.toThrowError(new AppError('Failed to create data', 500, 'Internal Server Error'));
  });
});
