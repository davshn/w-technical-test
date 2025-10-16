import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class TransactionProductDto {
  @IsInt({ message: 'El productId debe ser un número entero' })
  @Min(1, { message: 'El productId debe ser mayor a 0' })
  productId: number;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity: number;
}

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty({ message: 'El cliente es requerido' })
  @MaxLength(255, {
    message: 'El cliente no puede exceder 255 caracteres',
  })
  @Transform(({ value }) => value?.trim())
  customer: string;

  @IsArray({ message: 'Los productos deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => TransactionProductDto)
  products: TransactionProductDto[];
}
