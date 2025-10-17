import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transaction.service';
import { TransactionsController } from './transaction.controller';
import { Transaction } from './transaction.model';
import { TransactionProduct } from './transaction-product.model';
import { Product } from '../products/product.model';
import { PaymentService } from './payment.service';
import { of } from 'rxjs';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let mockTransactionModel: any;
  let mockTransactionProductModel: any;
  let mockProductModel: any;
  let mockPaymentService: any;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    uri: 'test-product',
    description: 'Test description',
    quantity: 10,
    value: 100000,
    get: jest.fn().mockReturnValue({
      id: 1,
      name: 'Test Product',
      value: 100000,
      quantity: 10,
    }),
  };

  const mockTransaction = {
    id: 'uuid-123',
    status: 'PENDING',
    transactionDate: new Date(),
    customer: 'client@example.com',
    total: 200000,
    paymentId: 'payment-123',
    products: [],
    get: jest.fn().mockReturnValue({
      id: 'uuid-123',
      status: 'PENDING',
      customer: 'client@example.com',
      total: 200000,
      paymentId: 'payment-123',
      products: [],
    }),
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
      update: jest.fn(),
    };

    mockPaymentService = {
      createTransaction: jest.fn(),
      validateTransaction: jest.fn(),
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
        {
          provide: PaymentService,
          useValue: mockPaymentService,
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

    it('should throw HttpException when transaction is not found', async () => {
      mockTransactionModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        new HttpException(
          'Transaction with id non-existent not found',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('create', () => {
    const createTransactionDto = {
      customer: 'client@example.com',
      products: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
      cardToken: 'tok_test_123',
      acceptance_token: 'accept_token_123',
      installments: 1,
    };

    it('should create a transaction successfully', async () => {
      const mockProduct2 = {
        ...mockProduct,
        id: 2,
        value: 150000,
        quantity: 5,
        get: jest.fn().mockReturnValue({
          id: 2,
          value: 150000,
          quantity: 5,
        }),
      };

      mockProductModel.findByPk
        .mockResolvedValueOnce(mockProduct)
        .mockResolvedValueOnce(mockProduct2);

      const createdTransaction = {
        id: 'uuid-456',
        customer: 'client@example.com',
        total: 350000,
      };

      mockTransactionModel.create.mockResolvedValue(createdTransaction);
      mockTransactionProductModel.create.mockResolvedValue({});

      const paymentResponse = {
        data: {
          id: 'payment-456',
          status: 'APPROVED',
          amount_in_cents: 350000,
        },
      };
      mockPaymentService.createTransaction.mockResolvedValue(paymentResponse);
      mockTransactionModel.update.mockResolvedValue([1, [createdTransaction]]);

      const result = await service.create(createTransactionDto);

      expect(mockProductModel.findByPk).toHaveBeenCalledTimes(2);
      expect(mockTransactionModel.create).toHaveBeenCalledWith({
        total: 350000,
        customer: 'client@example.com',
      });
      expect(mockTransactionProductModel.create).toHaveBeenCalledTimes(2);
      expect(mockPaymentService.createTransaction).toHaveBeenCalledWith({
        total: 350000,
        id: 'uuid-456',
        ...createTransactionDto,
      });
      expect(mockTransactionModel.update).toHaveBeenCalledWith(
        { status: 'PENDING', paymentId: 'payment-456' },
        { where: { id: 'uuid-456' }, returning: true },
      );
      expect(result).toEqual(paymentResponse.data);
    });

    it('should throw HttpException when product not found', async () => {
      mockProductModel.findByPk.mockResolvedValue(null);

      await expect(service.create(createTransactionDto)).rejects.toThrow(
        new HttpException(
          'El producto con id 1 no fue encontrado',
          HttpStatus.NOT_FOUND,
        ),
      );

      expect(mockTransactionModel.create).not.toHaveBeenCalled();
    });

    it('should throw HttpException when insufficient stock', async () => {
      const lowStockProduct = {
        ...mockProduct,
        get: jest.fn().mockReturnValue({
          id: 1,
          value: 100000,
          quantity: 1,
        }),
      };

      mockProductModel.findByPk.mockResolvedValue(lowStockProduct);

      await expect(service.create(createTransactionDto)).rejects.toThrow(
        new HttpException(
          'El producto con id 1 no tiene suficientes existencias',
          HttpStatus.NOT_FOUND,
        ),
      );
    });

    it('should calculate total correctly with multiple products', async () => {
      mockProductModel.findByPk
        .mockResolvedValueOnce({
          get: jest.fn().mockReturnValue({ value: 100000, quantity: 10 }),
        })
        .mockResolvedValueOnce({
          get: jest.fn().mockReturnValue({ value: 50000, quantity: 5 }),
        });

      mockTransactionModel.create.mockResolvedValue({
        id: 'uuid-789',
        total: 250000,
      });

      mockTransactionProductModel.create.mockResolvedValue({});
      mockPaymentService.createTransaction.mockResolvedValue({
        data: { id: 'payment-789' },
      });
      mockTransactionModel.update.mockResolvedValue([1, []]);

      await service.create(createTransactionDto);

      expect(mockTransactionModel.create).toHaveBeenCalledWith({
        total: 250000,
        customer: 'client@example.com',
      });
    });
  });

  describe('update', () => {
    it('should validate and finalize transaction successfully', async () => {
      const transactionWithProducts = {
        ...mockTransaction,
        get: jest.fn().mockReturnValue({
          id: 'uuid-123',
          paymentId: 'payment-123',
          products: [
            {
              id: 1,
              quantity: 10,
              TransactionProduct: { quantity: 2 },
            },
          ],
        }),
      };

      mockTransactionModel.findByPk.mockResolvedValueOnce(
        transactionWithProducts,
      );

      mockPaymentService.validateTransaction.mockResolvedValue({
        data: { status: 'APPROVED' },
      });

      mockProductModel.update.mockResolvedValue([1, []]);
      mockTransactionModel.update.mockResolvedValue([1, []]);
      mockTransactionModel.findByPk.mockResolvedValueOnce({ id: 'uuid-123' });

      await service.update('uuid-123');

      expect(mockPaymentService.validateTransaction).toHaveBeenCalledWith(
        'payment-123',
      );
      expect(mockProductModel.update).toHaveBeenCalledWith(
        { quantity: 8 },
        { where: { id: 1 } },
      );
      expect(mockTransactionModel.update).toHaveBeenCalledWith(
        { status: 'ASSIGNED' },
        { where: { id: 'uuid-123' } },
      );
    });

    it('should throw HttpException when payment is not approved', async () => {
      mockTransactionModel.findByPk.mockResolvedValue({
        get: jest.fn().mockReturnValue({ paymentId: 'payment-123' }),
      });

      mockPaymentService.validateTransaction.mockResolvedValue({
        data: { status: 'DECLINED' },
      });

      await expect(service.update('uuid-123')).rejects.toThrow(
        new HttpException('DECLINED', HttpStatus.OK),
      );
    });

    it('should throw HttpException when insufficient stock during finalization', async () => {
      const transactionWithProducts = {
        get: jest.fn().mockReturnValue({
          paymentId: 'payment-123',
          products: [
            {
              id: 1,
              quantity: 1,
              TransactionProduct: { quantity: 5 },
            },
          ],
        }),
      };

      mockTransactionModel.findByPk.mockResolvedValue(transactionWithProducts);
      mockPaymentService.validateTransaction.mockResolvedValue({
        data: { status: 'APPROVED' },
      });

      await expect(service.update('uuid-123')).rejects.toThrow(
        new HttpException('No hay suficientes existencias de 1', HttpStatus.OK),
      );
    });

    it('should update stock for multiple products', async () => {
      const transactionWithProducts = {
        get: jest.fn().mockReturnValue({
          paymentId: 'payment-123',
          products: [
            { id: 1, quantity: 10, TransactionProduct: { quantity: 2 } },
            { id: 2, quantity: 5, TransactionProduct: { quantity: 1 } },
          ],
        }),
      };

      mockTransactionModel.findByPk
        .mockResolvedValueOnce(transactionWithProducts)
        .mockResolvedValueOnce({ id: 'uuid-123' });

      mockPaymentService.validateTransaction.mockResolvedValue({
        data: { status: 'APPROVED' },
      });

      mockProductModel.update.mockResolvedValue([1, []]);
      mockTransactionModel.update.mockResolvedValue([1, []]);

      await service.update('uuid-123');

      expect(mockProductModel.update).toHaveBeenCalledTimes(2);
      expect(mockProductModel.update).toHaveBeenNthCalledWith(
        1,
        { quantity: 8 },
        { where: { id: 1 } },
      );
      expect(mockProductModel.update).toHaveBeenNthCalledWith(
        2,
        { quantity: 4 },
        { where: { id: 2 } },
      );
    });
  });
});

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: TransactionsService;
  let paymentService: PaymentService;

  const mockTransaction = {
    id: 'uuid-123',
    status: 'PENDING',
    transactionDate: new Date('2024-01-01'),
    customer: 'client@example.com',
    total: 200000,
    products: [],
  };

  const mockTransactionsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockPaymentService = {
    cardTokenice: jest.fn(),
    generateAceptanceTokens: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    paymentService = module.get<PaymentService>(PaymentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of transactions', async () => {
      const transactions = [mockTransaction];
      mockTransactionsService.findAll.mockResolvedValue(transactions);

      const result = await controller.findAll();

      expect(result).toEqual(transactions);
      expect(transactionsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no transactions exist', async () => {
      mockTransactionsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a transaction by id', async () => {
      mockTransactionsService.findOne.mockResolvedValue(mockTransaction);

      const result = await controller.findOne('uuid-123');

      expect(result).toEqual(mockTransaction);
      expect(transactionsService.findOne).toHaveBeenCalledWith('uuid-123');
    });

    it('should throw error when transaction not found', async () => {
      const error = new Error('Transaction with id uuid-999 not found');
      mockTransactionsService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('uuid-999')).rejects.toThrow(
        'Transaction with id uuid-999 not found',
      );
    });
  });

  describe('generateAceptanceTokens', () => {
    it('should return acceptance token', async () => {
      const acceptanceToken = {
        presigned_acceptance: 'eyJhbGc...',
      };

      mockPaymentService.generateAceptanceTokens.mockResolvedValue(
        acceptanceToken,
      );

      const result = await controller.generateAceptanceTokens();

      expect(result).toEqual(acceptanceToken);
      expect(paymentService.generateAceptanceTokens).toHaveBeenCalledTimes(1);
    });

    it('should handle errors from payment service', async () => {
      const error = new Error('Payment gateway error');
      mockPaymentService.generateAceptanceTokens.mockRejectedValue(error);

      await expect(controller.generateAceptanceTokens()).rejects.toThrow(
        'Payment gateway error',
      );
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto = {
        customer: 'client@example.com',
        products: [{ productId: 1, quantity: 2 }],
        cardToken: 'tok_test_123',
        acceptance_token: 'accept_token_123',
        installments: 1,
      };

      const paymentResponse = {
        id: 'payment-123',
        status: 'APPROVED',
      };

      mockTransactionsService.create.mockResolvedValue(paymentResponse);

      const result = await controller.create(createTransactionDto);

      expect(result).toEqual(paymentResponse);
      expect(transactionsService.create).toHaveBeenCalledWith(
        createTransactionDto,
      );
    });

    it('should handle product not found error', async () => {
      const createTransactionDto = {
        customer: 'client@example.com',
        products: [{ productId: 999, quantity: 1 }],
        cardToken: 'tok_test_123',
        acceptance_token: 'accept_token_123',
        installments: 1,
      };

      const error = new Error('El producto con id 999 no fue encontrado');
      mockTransactionsService.create.mockRejectedValue(error);

      await expect(controller.create(createTransactionDto)).rejects.toThrow(
        'El producto con id 999 no fue encontrado',
      );
    });
  });

  describe('update', () => {
    it('should validate and finalize transaction', async () => {
      const finalizedTransaction = {
        ...mockTransaction,
        status: 'ASSIGNED',
      };

      mockTransactionsService.update.mockResolvedValue(finalizedTransaction);

      const result = await controller.update('uuid-123');

      expect(result).toEqual(finalizedTransaction);
      expect(transactionsService.update).toHaveBeenCalledWith('uuid-123');
    });

    it('should handle payment not approved', async () => {
      const error = new Error('DECLINED');
      mockTransactionsService.update.mockRejectedValue(error);

      await expect(controller.update('uuid-123')).rejects.toThrow('DECLINED');
    });
  });

  describe('cardTokenice', () => {
    it('should tokenize card successfully', () => {
      const cardData = {
        number: '4111111111111111',
        cvc: '123',
        exp_month: '12',
        exp_year: '25',
        card_holder: 'JOHN DOE',
      };

      const tokenResponse = {
        data: {
          id: 'tok_test_123',
          brand: 'VISA',
          last_four: '1111',
        },
      };

      mockPaymentService.cardTokenice.mockReturnValue(of(tokenResponse));

      const result = controller.cardTokenice(cardData);

      result.subscribe((res) => {
        expect(res).toEqual(tokenResponse);
      });

      expect(paymentService.cardTokenice).toHaveBeenCalledWith(cardData);
    });

    it('should handle invalid card data', () => {
      const invalidCardData = {
        number: '1234567890',
        cvc: '12',
        exp_month: '13',
        exp_year: '20',
        card_holder: 'TEST',
      };

      const error = new Error('Invalid card data');
      mockPaymentService.cardTokenice.mockReturnValue(
        of({ error: error.message }),
      );

      const result = controller.cardTokenice(invalidCardData);

      result.subscribe((res) => {
        expect(res).toHaveProperty('error');
      });
    });
  });
});
