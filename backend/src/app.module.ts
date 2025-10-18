import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { Product } from './products/product.model';
import { Transaction } from './transactions/transaction.model';
import { TransactionProduct } from './transactions/transaction-product.model';
import { ProductsModule } from './products/product.module';
import { TransactionsModule } from './transactions/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT as string) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'mydatabase',
      dialectOptions: {
        ssl: {
          require: false,
          rejectUnauthorized: false,
        },
      },
      autoLoadModels: true,
      models: [Product, Transaction, TransactionProduct],
      synchronize: false,
      logging: false,
    }),
    ProductsModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
