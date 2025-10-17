import {
  Column,
  Model,
  Table,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../products/product.model';
import { TransactionProduct } from './transaction-product.model';
import { UUIDV4 } from 'sequelize';

@Table({
  tableName: 'transactions',
  timestamps: false,
})
export class Transaction extends Model {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID de la transacción',
  })
  @Column({
    type: DataType.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ApiProperty({
    example: 'APPROVED',
    enum: [
      'INITIALIZED',
      'PENDING',
      'APPROVED',
      'DECLINED',
      'VOIDED',
      'ERROR',
      'ASSIGNED',
      'FINISHED',
    ],
    description: 'Estado actual de la transacción',
  })
  @Column({
    type: DataType.ENUM(
      'INITIALIZED',
      'PENDING',
      'APPROVED',
      'DECLINED',
      'VOIDED',
      'ERROR',
      'ASSIGNED',
      'FINISHED',
    ),
    allowNull: false,
    defaultValue: 'INITIALIZED',
  })
  status: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'Fecha de la transacción',
  })
  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  transactionDate: Date;

  @ApiProperty({
    example: 'cliente@example.com',
    description: 'Email del cliente',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  customer: string;

  @ApiProperty({
    example: 900000000,
    description: 'Monto total en centavos COP',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  total: number;

  @ApiProperty({
    example: '12345-1734567890-12345',
    description: 'ID de pago del proveedor',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  paymentId: string;

  @BelongsToMany(() => Product, () => TransactionProduct)
  products: Product[];
}
