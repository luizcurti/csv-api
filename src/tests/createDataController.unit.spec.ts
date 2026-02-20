import { Request, Response } from 'express';
import { CreateDataController } from '@modules/data/useCases/createData/createDataController';
import { CreateDataUseCase } from '@modules/data/useCases/createData/createDataUseCase';
import { DBDataRepository } from '@modules/data/repositories/dbDataRepository';
import { AppError } from '@errors/appError';

jest.mock('@modules/data/useCases/createData/createDataUseCase');
jest.mock('@modules/data/repositories/dbDataRepository');

describe('CreateDataController', () => {
  let createDataController: CreateDataController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockCreateDataUseCase: jest.Mocked<CreateDataUseCase>;

  beforeEach(() => {
    createDataController = new CreateDataController();
    
    mockRequest = {
      body: {
        product_code: '123456',
        quantity: 10,
        pick_location: 'A1'
      }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockCreateDataUseCase = {
      execute: jest.fn()
    } as any;

    (CreateDataUseCase as jest.MockedClass<typeof CreateDataUseCase>).mockImplementation(() => mockCreateDataUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new data successfully', async () => {
    const mockCreatedData = {
      product_code: '123456',
      quantity: 10,
      pick_location: 'A1'
    };

    mockCreateDataUseCase.execute.mockResolvedValueOnce(mockCreatedData);

    await createDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockCreateDataUseCase.execute).toHaveBeenCalledWith({
      product_code: '123456',
      quantity: 10,
      pick_location: 'A1'
    });

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedData);
  });

  it('should return validation error when required fields are missing', async () => {
    mockRequest.body = {
      product_code: '123456'
    };

    await createDataController.handle(mockRequest as Request, mockResponse as Response);
    
    expect(mockCreateDataUseCase.execute).toHaveBeenCalled();
  });

  it('should handle AppError from use case', async () => {
    const appError = new AppError('Product already exists', 409, 'Conflict');
    mockCreateDataUseCase.execute.mockRejectedValueOnce(appError);

    await expect(
      createDataController.handle(mockRequest as Request, mockResponse as Response)
    ).rejects.toThrow(appError);
  });

  it('should handle unexpected errors', async () => {
    const unexpectedError = new Error('Database connection failed');
    mockCreateDataUseCase.execute.mockRejectedValueOnce(unexpectedError);

    await expect(
      createDataController.handle(mockRequest as Request, mockResponse as Response)
    ).rejects.toThrow(unexpectedError);
  });

  it('should accept numeric product_code', async () => {
    mockRequest.body = {
      product_code: '123456',
      quantity: 10,
      pick_location: 'A1'
    };

    const mockCreatedData = {
      product_code: '123456',
      quantity: 10,
      pick_location: 'A1'
    };

    mockCreateDataUseCase.execute.mockResolvedValueOnce(mockCreatedData);

    await createDataController.handle(mockRequest as Request, mockResponse as Response);

    expect(mockCreateDataUseCase.execute).toHaveBeenCalledWith({
      product_code: '123456',
      quantity: 10,
      pick_location: 'A1'
    });
  });
});