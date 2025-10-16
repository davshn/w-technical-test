import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'La URI es requerida' })
  @MaxLength(255)
  @IsUrl()
  @Transform(({ value }) => value?.trim().toLowerCase())
  uri: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @MaxLength(1000, {
    message: 'La descripción no puede exceder 1000 caracteres',
  })
  @Transform(({ value }) => value?.trim())
  description: string;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(0, { message: 'La cantidad no puede ser negativa' })
  quantity: number;

  @IsInt({ message: 'El valor debe ser un número entero' })
  @Min(0, { message: 'El valor no puede ser negativo' })
  value: number;
}
