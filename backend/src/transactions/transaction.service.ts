import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './transaction.model';
import { TransactionProduct } from './transaction-product.model';
import { Product } from '../products/product.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { HttpStatus, HttpException } from '@nestjs/common';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction)
    private transactionModel: typeof Transaction,
    @InjectModel(TransactionProduct)
    private transactionProductModel: typeof TransactionProduct,
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.findAll({
      include: [
        {
          model: Product,
          through: { attributes: ['quantity'] },
        },
      ],
    });
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findByPk(id, {
      include: [
        {
          model: Product,
          through: { attributes: ['quantity'] },
        },
      ],
    });
    if (!transaction) {
      throw new HttpException(
        `Transaction with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return transaction;
  }

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    let total = 0;
    const productDetails: Array<{
      productId: number;
      quantity: number;
    }> = [];

    for (const item of createTransactionDto.products) {
      const product = await this.productModel.findByPk(item.productId);
      if (!product) {
        throw new HttpException(
          `Product with id ${item.productId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const subtotal = product.get({ plain: true }).value * item.quantity;
      total += subtotal;

      productDetails.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }
    const transaction = await this.transactionModel.create({
      total: total,
      customer: createTransactionDto.customer,
    });

    for (const detail of productDetails) {
      await this.transactionProductModel.create({
        transactionId: transaction.id,
        ...detail,
      });
    }
    return this.findOne(transaction.id);
  }

  async update(
    id: string,
    transactionData: Partial<Transaction>,
  ): Promise<[number, Transaction[]]> {
    return this.transactionModel.update(transactionData, {
      where: { id },
      returning: true,
    });
  }
}
