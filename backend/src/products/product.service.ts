import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productModel.findAll();
  }

  async create(productData: Partial<Product>): Promise<Product> {
    return this.productModel.create(productData);
  }

  async update(
    id: number,
    productData: Partial<Product>,
  ): Promise<[number, Product[]]> {
    return this.productModel.update(productData, {
      where: { id },
      returning: true,
    });
  }
}
