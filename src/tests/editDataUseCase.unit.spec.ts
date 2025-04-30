import { CreateDataUseCase } from '@modules/data/useCases/createData/createDataUseCase';
import { InMemoryLessonsRepository } from './InMemoryDataRepository';
import { EditDataUseCase } from '@modules/data/useCases/editData/editDataUseCase';
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

    const editData = new EditDataUseCase(inMemoryLessonsRepository);

    const dataEdit = await editData.execute({
      product_code: '123456',
      quantity: '20',
      pick_location: 'A2'
    });

    expect(dataEdit).toHaveProperty('product_code');
    expect(dataEdit).toHaveProperty('quantity');
    expect(dataEdit).toHaveProperty('pick_location');

    expect(dataEdit.product_code).toBe('123456');
    expect(dataEdit.quantity).toBe('20');
    expect(dataEdit.pick_location).toBe('A2');
  });

  it('should not remove a new data', async () => {
    const inMemoryLessonsRepository = new InMemoryLessonsRepository()
    const editData = new EditDataUseCase(inMemoryLessonsRepository);

    await expect(editData.execute({
      product_code: '123456',
      quantity: '20',
      pick_location: 'A2'
    })).rejects.toEqual(
      new AppError('Data does not exist', 404, 'Not Found')
    );
  });
});