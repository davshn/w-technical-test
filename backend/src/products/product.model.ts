import {
  Column,
  Model,
  Table,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionProduct } from '../transactions/transaction-product.model';
import { Transaction } from '../transactions/transaction.model';

@Table({
  tableName: 'products',
  timestamps: false,
})
export class Product extends Model {
  @ApiProperty({ example: 1, description: 'ID único del producto' })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ApiProperty({ example: 'Laptop Gaming', description: 'Nombre del producto' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'https://example.com/laptop',
    description: 'URL del producto',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  uri: string;

  @ApiProperty({
    example: 'Laptop de alto rendimiento',
    description: 'Descripción',
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @ApiProperty({ example: 10, description: 'Cantidad en stock' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @ApiProperty({ example: 450000000, description: 'Precio en centavos COP' })
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  value: number;

  @BelongsToMany(() => Transaction, () => TransactionProduct)
  transactions: Transaction[];
}
