import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Transaction } from './transaction.model';
import { Product } from '../products/product.model';

@Table({
  tableName: 'transaction_products',
  timestamps: false,
})
export class TransactionProduct extends Model {
  @ForeignKey(() => Transaction)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  transactionId: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  productId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;
}
