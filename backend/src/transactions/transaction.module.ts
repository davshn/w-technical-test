import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './transaction.model';
import { TransactionProduct } from './transaction-product.model';
import { Product } from '../products/product.model';
import { TransactionsService } from './transaction.service';
import { TransactionsController } from './transaction.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Transaction, TransactionProduct, Product]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
