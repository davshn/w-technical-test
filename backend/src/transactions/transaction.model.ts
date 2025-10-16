import {
  Column,
  Model,
  Table,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Product } from '../products/product.model';
import { TransactionProduct } from './transaction-product.model';
import { UUIDV4 } from 'sequelize';

@Table({
  tableName: 'transactions',
  timestamps: false,
})
export class Transaction extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM(
      'PENDING',
      'APPROVED',
      'DECLINED',
      'VOIDED',
      'ERROR',
      'FINISHED',
    ),
    allowNull: false,
    defaultValue: 'PENDING',
  })
  status: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  transactionDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customer: string;

  @Column({
    type: DataType.INTEGER,
    unique: false,
    allowNull: true,
  })
  total: number;

  @BelongsToMany(() => Product, () => TransactionProduct)
  products: Product[];
}
