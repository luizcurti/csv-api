import { Request, Response } from 'express';
import { ListAllDataController } from '@modules/data/useCases/listAllData/listAllDataController';
import { ListAllDataUseCase } from '@modules/data/useCases/listAllData/listAllDataUseCase';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';


jest.mock('@modules/data/useCases/listAllData/listAllDataUseCase');
jest.mock('@modules/data/repositories/dbDataRepository');

describe('ListAllDataController', () => {
  let listAllDataController: ListAllDataController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockListAllDataUseCase: jest.Mocked<ListAllDataUseCase>;

  beforeEach(() => {
    listAllDataController = new ListAllDataController();
    
    mockRequest = {
      query: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };


    mockListAllDataUseCase = {
      execute: jest.fn()
    } as any;
    
    (ListAllDataUseCase as jest.MockedClass<typeof ListAllDataUseCase>).mockImplementation(() => mockListAllDataUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should list all data successfully', async () => {
    const mockResult = {
      data: [
        {
          product_code: '123456',
          quantity: 10,
          pick_location: 'A1'
        },
        {
          product_code: '789012',
          quantity: 5,
          pick_location: 'B2'
        }
      ],
      pagination: {
        total: 2,
        limit: 100,
        offset: 0,
        hasMore: false
      }
    };

    mockListAllDataUseCase.execute.mockResolvedValueOnce(mockResult);

    await listAllDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockListAllDataUseCase.execute).toHaveBeenCalledWith({
      limit: undefined,
      offset: undefined
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
  });

  it('should return empty array when no data exists', async () => {
    const mockEmptyResult = {
      data: [],
      pagination: {
        total: 0,
        limit: 100,
        offset: 0,
        hasMore: false
      }
    };

    mockListAllDataUseCase.execute.mockResolvedValueOnce(mockEmptyResult);

    await listAllDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockListAllDataUseCase.execute).toHaveBeenCalledWith({
      limit: undefined,
      offset: undefined
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockEmptyResult);
  });

  it('should handle pagination with limit and offset', async () => {
    mockRequest.query = {
      limit: '50',
      offset: '10'
    };

    const mockResult = {
      data: [
        {
          product_code: '123456',
          quantity: 10,
          pick_location: 'A1'
        }
      ],
      pagination: {
        total: 100,
        limit: 50,
        offset: 10,
        hasMore: true
      }
    };

    mockListAllDataUseCase.execute.mockResolvedValueOnce(mockResult);

    await listAllDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockListAllDataUseCase.execute).toHaveBeenCalledWith({
      limit: 50,
      offset: 10
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
  });

  it('should handle errors from use case', async () => {
    const error = new Error('Failed to read CSV file');
    mockListAllDataUseCase.execute.mockRejectedValueOnce(error);

    await expect(
      listAllDataController.handle(mockRequest as Request, mockResponse as Response)
    ).rejects.toThrow(error);
  });

  it('should handle unexpected errors without message', async () => {
    const error = new Error('Unknown error');
    mockListAllDataUseCase.execute.mockRejectedValueOnce(error);

    await expect(
      listAllDataController.handle(mockRequest as Request, mockResponse as Response)
    ).rejects.toThrow();
  });
});