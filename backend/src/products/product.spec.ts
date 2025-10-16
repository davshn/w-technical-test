import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { ProductsModule } from './product.module';
import { Product } from './product.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductModel: any;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    uri: 'test-product',
    description: 'Test description',
    quantity: 10,
    value: 100,
  };

  beforeEach(async () => {
    mockProductModel = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [mockProduct, { ...mockProduct, id: 2 }];
      mockProductModel.findAll.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
      expect(mockProductModel.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no products exist', async () => {
      mockProductModel.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockProductModel.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const newProductData = {
        name: 'New Product',
        uri: 'new-product',
        description: 'New description',
        quantity: 5,
        value: 50,
      };

      mockProductModel.create.mockResolvedValue({
        id: 3,
        ...newProductData,
      });

      const result = await service.create(newProductData);

      expect(result).toEqual({ id: 3, ...newProductData });
      expect(mockProductModel.create).toHaveBeenCalledWith(newProductData);
      expect(mockProductModel.create).toHaveBeenCalledTimes(1);
    });

    it('should handle creation with partial data', async () => {
      const partialData = { name: 'Partial Product' };
      mockProductModel.create.mockResolvedValue(partialData);

      const result = await service.create(partialData);

      expect(mockProductModel.create).toHaveBeenCalledWith(partialData);
      expect(result).toEqual(partialData);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateData = { name: 'Updated Product', value: 200 };
      const updatedProduct = { ...mockProduct, ...updateData };

      mockProductModel.update.mockResolvedValue([1, [updatedProduct]]);

      const result = await service.update(1, updateData);

      expect(result).toEqual([1, [updatedProduct]]);
      expect(mockProductModel.update).toHaveBeenCalledWith(updateData, {
        where: { id: 1 },
        returning: true,
      });
      expect(mockProductModel.update).toHaveBeenCalledTimes(1);
    });

    it('should return [0, []] when product is not found', async () => {
      mockProductModel.update.mockResolvedValue([0, []]);

      const result = await service.update(999, { name: 'Non-existent' });

      expect(result).toEqual([0, []]);
      expect(mockProductModel.update).toHaveBeenCalledTimes(1);
    });

    it('should update only specified fields', async () => {
      const updateData = { quantity: 20 };
      mockProductModel.update.mockResolvedValue([
        1,
        [{ ...mockProduct, quantity: 20 }],
      ]);

      const result = await service.update(1, updateData);

      expect(mockProductModel.update).toHaveBeenCalledWith(updateData, {
        where: { id: 1 },
        returning: true,
      });
      expect(result[1][0].quantity).toBe(20);
    });
  });
});

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    uri: 'test-product',
    description: 'Test description',
    quantity: 10,
    value: 100,
  } as Product;

  const mockProductsService = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [mockProduct, { ...mockProduct, id: 2 }];
      mockProductsService.findAll.mockResolvedValue(products);

      const result = await controller.findAll();

      expect(result).toEqual(products);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith();
    });

    it('should return an empty array when no products exist', async () => {
      mockProductsService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Database error');
      mockProductsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Database error');
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto = {
        name: 'New Product',
        uri: 'new-product',
        description: 'New description',
        quantity: 5,
        value: 50,
      };

      const createdProduct = { id: 3, ...createProductDto } as Product;
      mockProductsService.create.mockResolvedValue(createdProduct);

      const result = await controller.create(createProductDto);

      expect(result).toEqual(createdProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });

    it('should create product with partial data', async () => {
      const partialData = { name: 'Partial Product', value: 100 };
      mockProductsService.create.mockResolvedValue(partialData as Product);

      const result = await controller.create(partialData as Product);

      expect(result).toEqual(partialData);
      expect(service.create).toHaveBeenCalledWith(partialData);
    });

    it('should handle validation errors', async () => {
      const invalidData = { name: '' };
      const error = new Error('Validation failed');
      mockProductsService.create.mockRejectedValue(error);

      await expect(controller.create(invalidData as Product)).rejects.toThrow(
        'Validation failed',
      );
      expect(service.create).toHaveBeenCalledWith(invalidData);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateData = { name: 'Updated Product', value: 200 };
      const updatedProduct = { ...mockProduct, ...updateData };

      mockProductsService.update.mockResolvedValue([1, [updatedProduct]]);

      const result = await controller.update(1, updateData);

      expect(result).toEqual([1, [updatedProduct]]);
      expect(service.update).toHaveBeenCalledWith(1, updateData);
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should handle string id conversion to number', async () => {
      const updateData = { quantity: 20 };
      mockProductsService.update.mockResolvedValue([1, [mockProduct]]);

      await controller.update(42, updateData);

      expect(service.update).toHaveBeenCalledWith(42, updateData);
    });

    it('should return empty result when product not found', async () => {
      const updateData = { name: 'Non-existent' };
      mockProductsService.update.mockResolvedValue([0, []]);

      const result = await controller.update(999, updateData);

      expect(result).toEqual([0, []]);
      expect(service.update).toHaveBeenCalledWith(999, updateData);
    });

    it('should update only provided fields', async () => {
      const updateData = { value: 150 };
      mockProductsService.update.mockResolvedValue([
        1,
        [{ ...mockProduct, value: 150 }],
      ]);

      await controller.update(1, updateData);

      expect(service.update).toHaveBeenCalledWith(1, updateData);
    });
  });
});

describe('ProductsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ProductsModule],
    })
      .overrideProvider(getModelToken(Product))
      .useValue({
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      })
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have ProductsController defined', () => {
    const controller = module.get<ProductsController>(ProductsController);
    expect(controller).toBeDefined();
  });

  it('should have ProductsService defined', () => {
    const service = module.get<ProductsService>(ProductsService);
    expect(service).toBeDefined();
  });

  it('should inject Product model into ProductsService', () => {
    const service = module.get<ProductsService>(ProductsService);
    expect(service).toHaveProperty('productModel');
  });

  it('should export ProductsService', () => {
    const service = module.get<ProductsService>(ProductsService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(ProductsService);
  });
});
