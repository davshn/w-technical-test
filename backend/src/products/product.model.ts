import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'products',
  timestamps: false,
})
export class Product extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  uri: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.INTEGER,
    unique: false,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.INTEGER,
    unique: false,
    allowNull: false,
  })
  value: number;
}
