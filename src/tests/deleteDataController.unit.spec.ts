import { Request, Response } from 'express';
import { DeleteDataController } from '@modules/data/useCases/deleteData/deleteDataController';
import { DeleteDataUseCase } from '@modules/data/useCases/deleteData/deleteDataUseCase';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';


jest.mock('@modules/data/useCases/deleteData/deleteDataUseCase');
jest.mock('@modules/data/repositories/dbDataRepository');

describe('DeleteDataController', () => {
  let deleteDataController: DeleteDataController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockDeleteDataUseCase: jest.Mocked<DeleteDataUseCase>;

  beforeEach(() => {
    deleteDataController = new DeleteDataController();
    
    mockRequest = {
      params: {
        product_code: '123456'
      }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };


    mockDeleteDataUseCase = {
      execute: jest.fn()
    } as any;

    (DeleteDataUseCase as jest.MockedClass<typeof DeleteDataUseCase>).mockImplementation(() => mockDeleteDataUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete data successfully', async () => {
    mockDeleteDataUseCase.execute.mockResolvedValueOnce(undefined);

    await deleteDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockDeleteDataUseCase.execute).toHaveBeenCalledWith({
      product_code: '123456'
    });

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Data deleted successfully.'
    });
  });

  it('should convert product_code to string', async () => {
    mockRequest.params = { product_code: '789012' };
    mockDeleteDataUseCase.execute.mockResolvedValueOnce(undefined);

    await deleteDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockDeleteDataUseCase.execute).toHaveBeenCalledWith({
      product_code: '789012'
    });
  });

  it('should handle 404 error when data not found', async () => {
    const notFoundError = {
      statusCode: 404,
      message: 'Data not found'
    };
    mockDeleteDataUseCase.execute.mockRejectedValueOnce(notFoundError);

    await deleteDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Data not found.',
      details: 'Data not found',
    });
  });

  it('should handle general errors from use case', async () => {
    const error = new Error('Database connection failed');
    mockDeleteDataUseCase.execute.mockRejectedValueOnce(error);

    await deleteDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Failed to delete data.',
      details: 'Database connection failed',
    });
  });

  it('should handle errors without message', async () => {
    const error = { someProperty: 'value' }; 
    mockDeleteDataUseCase.execute.mockRejectedValueOnce(error);

    await deleteDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Failed to delete data.',
      details: undefined,
    });
  });

  it('should handle missing params', async () => {
    mockRequest.params = {};
    mockDeleteDataUseCase.execute.mockResolvedValueOnce(undefined);

    await deleteDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockDeleteDataUseCase.execute).toHaveBeenCalledWith({
      product_code: 'undefined'
    });
  });
});