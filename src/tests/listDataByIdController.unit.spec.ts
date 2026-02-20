import { Request, Response } from 'express';
import { ListDataByIdController } from '@modules/data/useCases/listDataById/listDataByIdController';
import { ListDataByIdUseCase } from '@modules/data/useCases/listDataById/listDataByIdUseCase';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';

jest.mock('@modules/data/useCases/listDataById/listDataByIdUseCase');
jest.mock('@modules/data/repositories/dbDataRepository');

describe('ListDataByIdController', () => {
  let listDataByIdController: ListDataByIdController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockListDataByIdUseCase: jest.Mocked<ListDataByIdUseCase>;

  beforeEach(() => {
    listDataByIdController = new ListDataByIdController();
    
    mockRequest = {
      params: {
        product_code: '123456'
      }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockListDataByIdUseCase = {
      execute: jest.fn()
    } as any;

    (ListDataByIdUseCase as jest.MockedClass<typeof ListDataByIdUseCase>).mockImplementation(() => mockListDataByIdUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should list data by id successfully', async () => {
    const mockData = {
      product_code: '123456',
      quantity: 10,
      pick_location: 'A1'
    };

    mockListDataByIdUseCase.execute.mockResolvedValueOnce(mockData);

    await listDataByIdController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockListDataByIdUseCase.execute).toHaveBeenCalledWith({
      product_code: '123456'
    });

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockData);
  });

  it('should convert product_code to string', async () => {
    mockRequest.params = { product_code: '789012' };
    const mockData = {
      product_code: '789012',
      quantity: 5,
      pick_location: 'B2'
    };

    mockListDataByIdUseCase.execute.mockResolvedValueOnce(mockData);

    await listDataByIdController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockListDataByIdUseCase.execute).toHaveBeenCalledWith({
      product_code: '789012'
    });
  });

  it('should handle product not found error', async () => {
    const notFoundError = new Error('Product not found');
    mockListDataByIdUseCase.execute.mockRejectedValueOnce(notFoundError);

    await expect(
      listDataByIdController.handle(mockRequest as Request, mockResponse as Response)
    ).rejects.toThrow(notFoundError);
  });

  it('should handle general errors from use case', async () => {
    const error = new Error('Database connection failed');
    mockListDataByIdUseCase.execute.mockRejectedValueOnce(error);

    await expect(
      listDataByIdController.handle(mockRequest as Request, mockResponse as Response)
    ).rejects.toThrow(error);
  });

  it('should handle errors without message', async () => {
    const error = new Error('Unknown error');
    mockListDataByIdUseCase.execute.mockRejectedValueOnce(error);

    await expect(
      listDataByIdController.handle(mockRequest as Request, mockResponse as Response)
    ).rejects.toThrow();
  });

  it('should handle missing params', async () => {
    mockRequest.params = {};
    const mockData = {
      product_code: undefined,
      quantity: 10,
      pick_location: 'A1'
    };

    mockListDataByIdUseCase.execute.mockResolvedValueOnce(mockData);

    await listDataByIdController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockListDataByIdUseCase.execute).toHaveBeenCalledWith({
      product_code: undefined
    });
  });
});