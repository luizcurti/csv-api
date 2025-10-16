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
    
    mockRequest = {};

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
    const mockDataList = [
      {
        product_code: '123456',
        quantity: '10',
        pick_location: 'A1'
      },
      {
        product_code: '789012',
        quantity: '5',
        pick_location: 'B2'
      }
    ];

    mockListAllDataUseCase.execute.mockResolvedValueOnce(mockDataList);

    await listAllDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockListAllDataUseCase.execute).toHaveBeenCalledWith();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockDataList);
  });

  it('should return empty array when no data exists', async () => {
    const mockEmptyList: any[] = [];

    mockListAllDataUseCase.execute.mockResolvedValueOnce(mockEmptyList);

    await listAllDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockListAllDataUseCase.execute).toHaveBeenCalledWith();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockEmptyList);
  });

  it('should handle errors from use case', async () => {
    const error = new Error('Failed to read CSV file');
    mockListAllDataUseCase.execute.mockRejectedValueOnce(error);

    await listAllDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Failed to retrieve data.',
      details: 'Failed to read CSV file',
    });
  });

  it('should handle unexpected errors without message', async () => {
    const error = { someProperty: 'value' }; 
    mockListAllDataUseCase.execute.mockRejectedValueOnce(error);

    await listAllDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Failed to retrieve data.',
      details: undefined,
    });
  });
});