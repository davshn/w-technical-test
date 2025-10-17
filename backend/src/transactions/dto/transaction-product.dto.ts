import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionProductDto {
  @ApiProperty({
    description: 'ID del producto a comprar',
    example: 1,
    type: 'integer',
  })
  @IsInt({ message: 'El productId debe ser un número entero' })
  @Min(1, { message: 'El productId debe ser mayor a 0' })
  productId: number;

  @ApiProperty({
    description: 'Cantidad de unidades a comprar',
    example: 2,
    minimum: 1,
    type: 'integer',
  })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity: number;
}
