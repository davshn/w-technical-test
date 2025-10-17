import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsInt,
  Min,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionProductDto } from './transaction-product.dto';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Correo electrónico del cliente',
    example: 'cliente@example.com',
    format: 'email',
  })
  @IsString()
  @IsNotEmpty({ message: 'El correo del cliente es requerido' })
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  customer: string;

  @ApiProperty({
    description: 'Lista de productos con cantidades',
    type: [TransactionProductDto],
    example: [
      { productId: 1, quantity: 2 },
      { productId: 3, quantity: 1 },
    ],
  })
  @IsArray({ message: 'Los productos deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => TransactionProductDto)
  products: TransactionProductDto[];

  @ApiProperty({
    description: 'Token de la tarjeta tokenizada previamente',
    example: 'tok_test_12345_ABCDE12345FGHIJ67890',
  })
  @IsString()
  @IsNotEmpty({ message: 'Se requiere el token de la tarjeta a usar' })
  @Transform(({ value }) => value?.trim())
  cardToken: string;

  @ApiProperty({
    description: 'Token de aceptación de términos y condiciones',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty({ message: 'Se requiere el acceptance_token' })
  @Transform(({ value }) => value?.trim())
  acceptance_token: string;

  @ApiProperty({
    description: 'Número de cuotas para el pago',
    example: 1,
    minimum: 1,
    type: 'integer',
  })
  @IsInt({ message: 'Las cuotas deben ser un número entero' })
  @Min(1, { message: 'Las cuotas deben ser al menos 1' })
  installments: number;
}

export type NewTransactionDto = CreateTransactionDto & {
  total: number;
  id: string;
};
