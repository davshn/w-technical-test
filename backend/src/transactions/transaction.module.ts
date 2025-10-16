import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from './transaction.model';
import { TransactionProduct } from './transaction-product.model';
import { Product } from '../products/product.model';
import { TransactionsService } from './transaction.service';
import { TransactionsController } from './transaction.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Transaction, TransactionProduct, Product]),
    HttpModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, PaymentService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
