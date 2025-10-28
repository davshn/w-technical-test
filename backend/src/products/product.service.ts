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
    const allProducts = await this.productModel.findAll({ raw: true });
    const productsWithIva = allProducts.map((product: any) => {
      product.iva = product.value * 0.19;
      return product;
    });

    return productsWithIva;
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
