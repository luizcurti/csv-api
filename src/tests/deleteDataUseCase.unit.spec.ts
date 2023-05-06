import { CreateDataUseCase } from '@modules/data/useCases/createData/createDataUseCase';
import { DeleteDataUseCase } from '@modules/data/useCases/deleteData/deleteDataUseCase';
import { InMemoryLessonsRepository } from './InMemoryDataRepository';
import { AppError } from '@errors/appError';

describe('CreateDataUseCase', () => {
  it('should remove a new data', async () => {
    const inMemoryLessonsRepository = new InMemoryLessonsRepository()
    const createData = new CreateDataUseCase(inMemoryLessonsRepository);

    await createData.execute({ 
      product_code: '123456',
      quantity: '10',
      pick_location: 'A1'
    });

    const deleteData = new DeleteDataUseCase(inMemoryLessonsRepository);

    const dataDelete = await deleteData.execute({
      product_code: '123456'
    });

    expect(dataDelete).toEqual('Deleted');
  });

  it('should not remove a new data', async () => {
    const inMemoryLessonsRepository = new InMemoryLessonsRepository()
    const deleteData = new DeleteDataUseCase(inMemoryLessonsRepository);


    await expect(deleteData.execute({
      product_code: '123456'
    })).rejects.toEqual(
      new AppError('Data does not exist', 404, 'Not Found')
    );
  });
});