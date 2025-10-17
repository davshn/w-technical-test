import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpService: HttpService;

  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    process.env.PUBLIC_KEY = 'pub_test_key';
    process.env.ENVIRONMENT_URL = 'https://sandbox.test.com';
    process.env.INTEGRITY_SECRET = 'test_secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cardTokenice', () => {
    it('should tokenize card successfully', (done) => {
      const cardData = {
        number: '4111111111111111',
        cvc: '123',
        exp_month: '12',
        exp_year: '25',
        card_holder: 'JOHN DOE',
      };

      const response: AxiosResponse = {
        data: {
          status: 'CREATED',
          data: {
            id: 'tok_test_123',
            brand: 'VISA',
            last_four: '1111',
          },
        },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(response));

      service.cardTokenice(cardData).subscribe((result) => {
        expect(result).toEqual(response.data);
        expect(mockHttpService.post).toHaveBeenCalledWith(
          'https://sandbox.test.com/tokens/cards',
          cardData,
          {
            headers: {
              Authorization: 'Bearer pub_test_key',
              'Content-Type': 'application/json',
            },
          },
        );
        done();
      });
    });

    it('should handle tokenization error', (done) => {
      const cardData = {
        number: '4111111111111111',
        cvc: '123',
        exp_month: '12',
        exp_year: '25',
        card_holder: 'JOHN DOE',
      };

      const error = new Error('Invalid card');
      mockHttpService.post.mockReturnValue(throwError(() => error));

      service.cardTokenice(cardData).subscribe({
        error: (err) => {
          expect(err).toBe(error);
          done();
        },
      });
    });
  });

  describe('generateAceptanceTokens', () => {
    it('should generate acceptance tokens', async () => {
      const merchantResponse: AxiosResponse = {
        data: {
          data: {
            presigned_acceptance: 'eyJhbGc...',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.get.mockReturnValue(of(merchantResponse));

      const result = await service.generateAceptanceTokens();

      expect(result).toEqual({
        presigned_acceptance: 'eyJhbGc...',
      });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://sandbox.test.com/merchants/pub_test_key',
      );
    });
  });

  describe('createTransaction', () => {
    it('should create transaction successfully', async () => {
      const transactionDto = {
        id: 'uuid-123',
        total: 200000,
        customer: 'client@example.com',
        cardToken: 'tok_test_123',
        acceptance_token: 'accept_token_123',
        installments: 1,
        products: [],
      };

      const response: AxiosResponse = {
        data: {
          data: {
            id: 'payment-123',
            status: 'APPROVED',
            amount_in_cents: 200000,
          },
        },
        status: 201,
        statusText: 'Created',
        headers: {},
        config: {} as any,
      };

      mockHttpService.post.mockReturnValue(of(response));

      const result = await service.createTransaction(transactionDto);

      expect(result).toEqual(response.data);
      expect(mockHttpService.post).toHaveBeenCalled();
    });
  });

  describe('validateTransaction', () => {
    it('should validate transaction successfully', async () => {
      const response: AxiosResponse = {
        data: {
          data: {
            id: 'payment-123',
            status: 'APPROVED',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      mockHttpService.get.mockReturnValue(of(response));

      const result = await service.validateTransaction('payment-123');

      expect(result).toEqual(response.data);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://sandbox.test.com/transactions/payment-123',
        {
          headers: {
            Authorization: 'Bearer pub_test_key',
            'Content-Type': 'application/json',
          },
        },
      );
    });
  });
});
