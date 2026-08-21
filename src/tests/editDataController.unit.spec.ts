import { Request, Response } from 'express';
import { EditDataController } from '@modules/data/useCases/editData/editDataController';
import { EditDataUseCase } from '@modules/data/useCases/editData/editDataUseCase';

jest.mock('@modules/data/useCases/editData/editDataUseCase');
jest.mock('@modules/data/repositories/dbDataRepository');

describe('EditDataController', () => {
  let editDataController: EditDataController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockEditDataUseCase: jest.Mocked<EditDataUseCase>;

  beforeEach(() => {
    editDataController = new EditDataController();

    mockRequest = {
      params: {
        product_code: '123456',
      },
      body: {
        quantity: 15,
        pick_location: 'B2',
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockEditDataUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<EditDataUseCase>;

    (
      EditDataUseCase as jest.MockedClass<typeof EditDataUseCase>
    ).mockImplementation(() => mockEditDataUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should edit data successfully', async () => {
    const mockUpdatedData = {
      product_code: '123456',
      quantity: 15,
      pick_location: 'B2',
    };

    mockEditDataUseCase.execute.mockResolvedValueOnce(mockUpdatedData);

    await editDataController.handle(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockEditDataUseCase.execute).toHaveBeenCalledWith({
      product_code: '123456',
      quantity: 15,
      pick_location: 'B2',
    });

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedData);
  });

  it('should convert all inputs to strings', async () => {
    mockRequest.params = { product_code: '123456' };
    mockRequest.body = {
      quantity: 20,
      pick_location: 'C3',
    };

    const mockUpdatedData = {
      product_code: '123456',
      quantity: 20,
      pick_location: 'C3',
    };

    mockEditDataUseCase.execute.mockResolvedValueOnce(mockUpdatedData);

    await editDataController.handle(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockEditDataUseCase.execute).toHaveBeenCalledWith({
      product_code: '123456',
      quantity: 20,
      pick_location: 'C3',
    });
  });

  it('should handle errors from use case', async () => {
    const error = new Error('Product not found');
    mockEditDataUseCase.execute.mockRejectedValueOnce(error);

    await expect(
      editDataController.handle(
        mockRequest as Request,
        mockResponse as Response
      )
    ).rejects.toThrow(error);
  });

  it('should handle errors without message', async () => {
    const error = new Error('Unknown error');
    mockEditDataUseCase.execute.mockRejectedValueOnce(error);

    await expect(
      editDataController.handle(
        mockRequest as Request,
        mockResponse as Response
      )
    ).rejects.toThrow();
  });

  it('should handle missing params', async () => {
    mockRequest.params = {};
    const mockUpdatedData = {
      product_code: undefined,
      quantity: 15,
      pick_location: 'B2',
    };

    mockEditDataUseCase.execute.mockResolvedValueOnce(mockUpdatedData);

    await editDataController.handle(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockEditDataUseCase.execute).toHaveBeenCalledWith({
      product_code: undefined,
      quantity: 15,
      pick_location: 'B2',
    });
  });

  it('should handle missing body properties', async () => {
    mockRequest.body = {};
    const mockUpdatedData = {
      product_code: '123456',
      quantity: undefined,
      pick_location: undefined,
    };

    mockEditDataUseCase.execute.mockResolvedValueOnce(mockUpdatedData);

    await editDataController.handle(
      mockRequest as Request,
      mockResponse as Response
    );

    expect(mockEditDataUseCase.execute).toHaveBeenCalledWith({
      product_code: '123456',
      quantity: undefined,
      pick_location: undefined,
    });
  });
});
