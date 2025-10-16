import {
  IsString,
  IsNotEmpty,
  Matches,
  Length,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  IsCreditCard,
  IsVisaOrMastercard,
  IsCVV,
  IsValidExpMonth,
  IsValidExpYear,
  IsNotExpired,
} from '../validators/card.validator';

export class CardTokenizationDto {
  @IsString()
  @IsNotEmpty({ message: 'El número de tarjeta es requerido' })
  @Transform(({ value }) => value?.replace(/[\s-]/g, ''))
  @IsCreditCard({ message: 'Número de tarjeta inválido' })
  @IsVisaOrMastercard({ message: 'Solo se aceptan tarjetas Visa o Mastercard' })
  number: string;

  @IsString()
  @IsNotEmpty({ message: 'El CVV es requerido' })
  @IsCVV({ message: 'CVV inválido (debe tener 3 o 4 dígitos)' })
  @Transform(({ value }) => value?.trim())
  cvc: string;

  @IsString()
  @IsNotEmpty({ message: 'El mes de expiración es requerido' })
  @Matches(/^(0[1-9]|1[0-2])$/, {
    message: 'Mes de expiración inválido (formato: 01-12)',
  })
  @IsValidExpMonth()
  @Transform(({ value }) => value?.padStart(2, '0'))
  exp_month: string;

  @IsString()
  @IsNotEmpty({ message: 'El año de expiración es requerido' })
  @Length(2, 2, { message: 'El año debe tener exactamente 2 dígitos' })
  @Matches(/^\d{2}$/, {
    message: 'Año de expiración inválido (formato: YY, ej: 25)',
  })
  @IsValidExpYear()
  @IsNotExpired({ message: 'La tarjeta está vencida' })
  @Transform(({ value }) => value?.trim())
  exp_year: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del titular es requerido' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @Transform(({ value }) => value?.trim().toUpperCase())
  card_holder: string;
}
