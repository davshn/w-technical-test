import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './transaction.model';
import { TransactionProduct } from './transaction-product.model';
import { Product } from '../products/product.model';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { HttpStatus, HttpException } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction)
    private transactionModel: typeof Transaction,
    @InjectModel(TransactionProduct)
    private transactionProductModel: typeof TransactionProduct,
    @InjectModel(Product)
    private productModel: typeof Product,
    private readonly paymentService: PaymentService,
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
          `El producto con id ${item.productId} no fue encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }
      if (product.get({ plain: true }).quantity < item.quantity) {
        throw new HttpException(
          `El producto con id ${item.productId} no tiene suficientes existencias`,
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
    const newTransactionData = { total, id: transaction.id };

    const { data } = await this.paymentService.createTransaction({
      ...newTransactionData,
      ...createTransactionDto,
    });

    await this.transactionModel.update(
      { status: 'PENDING', paymentId: data.id },
      {
        where: { id: transaction.id },
        returning: true,
      },
    );

    return data;
  }

  async update(id: string): Promise<any> {
    const transaction = await this.transactionModel.findByPk(id, {
      include: [
        {
          model: Product,
          through: { attributes: ['quantity'] },
        },
      ],
    });

    const { data } = await this.paymentService.validateTransaction(
      transaction!.get({ plain: true }).paymentId,
    );
    if (data.status !== 'APPROVED') {
      throw new HttpException(`${data.status}`, HttpStatus.OK);
    }

    for (const item of transaction!.get({ plain: true }).products) {
      const newQuantity = item.quantity - item.TransactionProduct.quantity;
      if (newQuantity < 0) {
        throw new HttpException(
          `No hay suficientes existencias de ${item.id}`,
          HttpStatus.OK,
        );
      }
      await this.productModel.update(
        { quantity: newQuantity },
        { where: { id: item.id } },
      );
    }

    await this.transactionModel.update(
      { status: 'ASSIGNED' },
      { where: { id } },
    );

    return await this.transactionModel.findByPk(id);
  }
}
