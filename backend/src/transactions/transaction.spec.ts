import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { TransactionsService } from './transaction.service';
import { TransactionsController } from './transaction.controller';
import { TransactionsModule } from './transaction.module';
import { Transaction } from './transaction.model';
import { TransactionProduct } from './transaction-product.model';
import { Product } from '../products/product.model';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockTransactionModel: any;
  let mockTransactionProductModel: any;
  let mockProductModel: any;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    uri: 'test-product',
    description: 'Test description',
    quantity: 10,
    value: 100,
    get: jest.fn().mockReturnValue({
      id: 1,
      name: 'Test Product',
      value: 100,
    }),
  };

  const mockTransaction = {
    id: 'uuid-123',
    status: 'PENDING',
    transactionDate: new Date(),
    customer: 'John Doe',
    total: 200,
    products: [],
  };

  beforeEach(async () => {
    mockTransactionModel = {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    mockTransactionProductModel = {
      create: jest.fn(),
    };

    mockProductModel = {
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getModelToken(Transaction),
          useValue: mockTransactionModel,
        },
        {
          provide: getModelToken(TransactionProduct),
          useValue: mockTransactionProductModel,
        },
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of transactions with products', async () => {
      const transactions = [mockTransaction];
      mockTransactionModel.findAll.mockResolvedValue(transactions);

      const result = await service.findAll();

      expect(result).toEqual(transactions);
      expect(mockTransactionModel.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Product,
            through: { attributes: ['quantity'] },
          },
        ],
      });
      expect(mockTransactionModel.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no transactions exist', async () => {
      mockTransactionModel.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      mockTransactionModel.findByPk.mockResolvedValue(mockTransaction);

      const result = await service.findOne('uuid-123');

      expect(result).toEqual(mockTransaction);
      expect(mockTransactionModel.findByPk).toHaveBeenCalledWith('uuid-123', {
        include: [
          {
            model: Product,
            through: { attributes: ['quantity'] },
          },
        ],
      });
    });

    it('should throw an error when transaction is not found', async () => {
      mockTransactionModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        'Transaction with id non-existent not found',
      );
    });
  });

  describe('create', () => {
    const createTransactionDto = {
      customer: 'Jane Doe',
      products: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
    };

    it('should create a transaction with products successfully', async () => {
      const mockProduct2 = {
        ...mockProduct,
        id: 2,
        value: 150,
        get: jest.fn().mockReturnValue({ id: 2, value: 150 }),
      };

      mockProductModel.findByPk
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce(mockProduct2);

      const createdTransaction = {
        id: 'uuid-456',
        customer: 'Jane Doe',
        total: 350, // (100 * 2) + (150 * 1)
      };

      mockTransactionModel.create.mockResolvedValue(createdTransaction);
      mockTransactionProductModel.create.mockResolvedValue({});
      mockTransactionModel.findByPk.mockResolvedValue({
        ...createdTransaction,
        products: [mockProduct, mockProduct2],
      });

      const result = await service.create(createTransactionDto);

      expect(mockProductModel.findByPk).toHaveBeenCalledTimes(2);
      expect(mockTransactionModel.create).toHaveBeenCalledWith({
        total: 350,
        customer: 'Jane Doe',
      });
      expect(mockTransactionProductModel.create).toHaveBeenCalledTimes(2);
      expect(result.total).toBe(350);
    });

    it('should throw error when product not found', async () => {
      mockProductModel.findByPk.mockResolvedValue(null);

      await expect(service.create(createTransactionDto)).rejects.toThrow(
        'Product with id 1 not found',
      );

      expect(mockTransactionModel.create).not.toHaveBeenCalled();
      expect(mockTransactionProductModel.create).not.toHaveBeenCalled();
    });

    it('should calculate total correctly with multiple products', async () => {
      mockProductModel.findByPk.mockResolvedValue({
        ...mockProduct,
        get: jest.fn().mockReturnValue({ value: 100 }),
      });

      mockTransactionModel.create.mockResolvedValue({
        id: 'uuid-789',
        customer: 'Test Customer',
        total: 200,
      });

      mockTransactionProductModel.create.mockResolvedValue({});
      mockTransactionModel.findByPk.mockResolvedValue({
        id: 'uuid-789',
        total: 200,
        products: [],
      });

      const dto = {
        customer: 'Test Customer',
        products: [{ productId: 1, quantity: 2 }],
      };

      await service.create(dto);

      expect(mockTransactionModel.create).toHaveBeenCalledWith({
        total: 200,
        customer: 'Test Customer',
      });
    });

    it('should create transaction product entries for all products', async () => {
      mockProductModel.findByPk.mockResolvedValue(mockProduct);

      mockTransactionModel.create.mockResolvedValue({
        id: 'uuid-test',
        customer: 'Customer',
        total: 100,
      });

      mockTransactionProductModel.create.mockResolvedValue({});
      mockTransactionModel.findByPk.mockResolvedValue({
        id: 'uuid-test',
        products: [],
      });

      const dto = {
        customer: 'Customer',
        products: [{ productId: 1, quantity: 1 }],
      };

      await service.create(dto);

      expect(mockTransactionProductModel.create).toHaveBeenCalledWith({
        transactionId: 'uuid-test',
        productId: 1,
        quantity: 1,
      });
    });
  });

  describe('update', () => {
    it('should update a transaction successfully', async () => {
      const updateData = { status: 'COMPLETED' };
      const updatedTransaction = { ...mockTransaction, status: 'COMPLETED' };

      mockTransactionModel.update.mockResolvedValue([1, [updatedTransaction]]);

      const result = await service.update('1', updateData);

      expect(result).toEqual([1, [updatedTransaction]]);
      expect(mockTransactionModel.update).toHaveBeenCalledWith(updateData, {
        where: { id: '1' },
        returning: true,
      });
    });

    it('should return [0, []] when transaction is not found', async () => {
      mockTransactionModel.update.mockResolvedValue([0, []]);

      const result = await service.update('999', { status: 'CANCELLED' });

      expect(result).toEqual([0, []]);
    });
  });
});

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: TransactionsService;

  const mockTransaction = {
    id: 'uuid-123',
    status: 'PENDING',
    transactionDate: new Date('2024-01-01'),
    customer: 'John Doe',
    total: 200,
    products: [],
  };

  const mockTransactionsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get<TransactionsService>(TransactionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const transactions = [
        mockTransaction,
        { ...mockTransaction, id: 'uuid-456' },
      ];
      mockTransactionsService.findAll.mockResolvedValue(transactions);

      const result = await controller.findAll();

      expect(result).toEqual(transactions);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith();
    });

    it('should return transactions with products included', async () => {
      const transactionWithProducts = {
        ...mockTransaction,
        products: [
          { id: 1, name: 'Product 1', value: 100 },
          { id: 2, name: 'Product 2', value: 100 },
        ],
      };
      mockTransactionsService.findAll.mockResolvedValue([
        transactionWithProducts,
      ]);

      const result = await controller.findAll();

      expect(result[0].products).toHaveLength(2);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no transactions exist', async () => {
      mockTransactionsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      mockTransactionsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      mockTransactionsService.findOne.mockResolvedValue(mockTransaction);

      const result = await controller.findOne('uuid-123');

      expect(result).toEqual(mockTransaction);
      expect(service.findOne).toHaveBeenCalledWith('uuid-123');
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return transaction with products', async () => {
      const transactionWithProducts = {
        ...mockTransaction,
        products: [{ id: 1, name: 'Product 1' }],
      };
      mockTransactionsService.findOne.mockResolvedValue(
        transactionWithProducts,
      );

      const result = await controller.findOne('uuid-123');

      expect(result.products).toHaveLength(1);
      expect(service.findOne).toHaveBeenCalledWith('uuid-123');
    });

    it('should throw error when transaction not found', async () => {
      const error = new Error('Transaction with id uuid-999 not found');
      mockTransactionsService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('uuid-999')).rejects.toThrow(
        'Transaction with id uuid-999 not found',
      );
      expect(service.findOne).toHaveBeenCalledWith('uuid-999');
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto = {
        customer: 'Jane Doe',
        products: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      };

      const createdTransaction = {
        id: 'uuid-new',
        customer: 'Jane Doe',
        total: 300,
        status: 'PENDING',
        products: [],
      };

      mockTransactionsService.create.mockResolvedValue(createdTransaction);

      const result = await controller.create(createTransactionDto);

      expect(result).toEqual(createdTransaction);
      expect(service.create).toHaveBeenCalledWith(createTransactionDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should create transaction with single product', async () => {
      const createTransactionDto = {
        customer: 'Single Product Customer',
        products: [{ productId: 1, quantity: 1 }],
      };

      mockTransactionsService.create.mockResolvedValue({
        ...mockTransaction,
        customer: 'Single Product Customer',
      });

      const result = await controller.create(createTransactionDto);

      expect(service.create).toHaveBeenCalledWith(createTransactionDto);
      expect(result.customer).toBe('Single Product Customer');
    });

    it('should handle product not found error', async () => {
      const createTransactionDto = {
        customer: 'Test Customer',
        products: [{ productId: 999, quantity: 1 }],
      };

      const error = new Error('Product with id 999 not found');
      mockTransactionsService.create.mockRejectedValue(error);

      await expect(controller.create(createTransactionDto)).rejects.toThrow(
        'Product with id 999 not found',
      );
      expect(service.create).toHaveBeenCalledWith(createTransactionDto);
    });

    it('should handle empty products array', async () => {
      const createTransactionDto = {
        customer: 'Empty Cart',
        products: [],
      };

      mockTransactionsService.create.mockResolvedValue({
        ...mockTransaction,
        total: 0,
      });

      const result = await controller.create(createTransactionDto);

      expect(service.create).toHaveBeenCalledWith(createTransactionDto);
      expect(result.total).toBe(0);
    });
  });

  describe('update', () => {
    it('should update a transaction status', async () => {
      const updateData = { status: 'COMPLETED' };
      const updatedTransaction = { ...mockTransaction, status: 'COMPLETED' };

      mockTransactionsService.update.mockResolvedValue([
        1,
        [updatedTransaction],
      ]);

      const result = await controller.update('uuid-123', updateData);

      expect(result).toEqual([1, [updatedTransaction]]);
      expect(service.update).toHaveBeenCalledWith('uuid-123', updateData);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should update transaction customer name', async () => {
      const updateData = { customer: 'Updated Name' };
      mockTransactionsService.update.mockResolvedValue([1, [mockTransaction]]);

      await controller.update('uuid-123', updateData);

      expect(service.update).toHaveBeenCalledWith('uuid-123', updateData);
    });

    it('should return empty result when transaction not found', async () => {
      const updateData = { status: 'CANCELLED' };
      mockTransactionsService.update.mockResolvedValue([0, []]);

      const result = await controller.update('uuid-999', updateData);

      expect(result).toEqual([0, []]);
    });

    it('should handle partial updates', async () => {
      const updateData = { total: 500 };
      mockTransactionsService.update.mockResolvedValue([
        1,
        [{ ...mockTransaction, total: 500 }],
      ]);

      const result = await controller.update('uuid-123', updateData);

      expect(service.update).toHaveBeenCalledWith('uuid-123', updateData);
      expect(result[1][0].total).toBe(500);
    });
  });
});

describe('TransactionsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TransactionsModule],
    })
      .overrideProvider(getModelToken(Transaction))
      .useValue({
        findAll: jest.fn(),
        findByPk: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      })
      .overrideProvider(getModelToken(TransactionProduct))
      .useValue({
        create: jest.fn(),
      })
      .overrideProvider(getModelToken(Product))
      .useValue({
        findByPk: jest.fn(),
      })
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have TransactionsController defined', () => {
    const controller = module.get<TransactionsController>(
      TransactionsController,
    );
    expect(controller).toBeDefined();
  });

  it('should have TransactionsService defined', () => {
    const service = module.get<TransactionsService>(TransactionsService);
    expect(service).toBeDefined();
  });

  it('should inject all required models into TransactionsService', () => {
    const service = module.get<TransactionsService>(TransactionsService);
    expect(service).toHaveProperty('transactionModel');
    expect(service).toHaveProperty('transactionProductModel');
    expect(service).toHaveProperty('productModel');
  });

  it('should export TransactionsService', () => {
    const service = module.get<TransactionsService>(TransactionsService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(TransactionsService);
  });
});
