import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Gaming ASUS ROG',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'URL de la imagen o página del producto',
    example: 'https://example.com/productos/laptop-gaming',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty({ message: 'La URI es requerida' })
  @MaxLength(255)
  @IsUrl()
  @Transform(({ value }) => value?.trim().toLowerCase())
  uri: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example:
      'Laptop de alto rendimiento con procesador Intel i9, 32GB RAM, RTX 4080',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @MaxLength(1000)
  @Transform(({ value }) => value?.trim())
  description: string;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 15,
    minimum: 0,
    type: 'integer',
  })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(0, { message: 'La cantidad no puede ser negativa' })
  quantity: number;

  @ApiProperty({
    description: 'Precio del producto en centavos (COP)',
    example: 450000000,
    minimum: 0,
    type: 'integer',
  })
  @IsInt({ message: 'El valor debe ser un número entero' })
  @Min(0, { message: 'El valor no puede ser negativo' })
  value: number;
}
