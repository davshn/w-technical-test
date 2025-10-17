import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import * as cardValidator from 'card-validator';

export function IsCreditCard(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCreditCard',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const cleanValue = value.replace(/[\s-]/g, '');
          const validation = cardValidator.number(cleanValue);
          return validation.isValid;
        },
        defaultMessage() {
          return 'Número de tarjeta inválido';
        },
      },
    });
  };
}

export function IsVisaOrMastercard(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVisaOrMastercard',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const cleanValue = value.replace(/[\s-]/g, '');
          const validation = cardValidator.number(cleanValue);

          if (!validation.isValid) return false;
          const cardType = validation.card?.type;
          return cardType === 'visa' || cardType === 'mastercard';
        },
        defaultMessage() {
          return 'Solo se aceptan tarjetas Visa o Mastercard';
        },
      },
    });
  };
}

export function IsCVV(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCVV',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return /^\d{3,4}$/.test(value);
        },
        defaultMessage() {
          return 'CVV debe tener 3 o 4 dígitos';
        },
      },
    });
  };
}

export function IsValidExpMonth(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidExpMonth',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const month = parseInt(value, 10);
          return month >= 1 && month <= 12;
        },
        defaultMessage() {
          return 'Mes de expiración inválido (debe estar entre 01 y 12)';
        },
      },
    });
  };
}

export function IsValidExpYear(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidExpYear',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          if (!/^\d{2}$/.test(value)) return false;

          const year = parseInt(value, 10);
          const currentYear = new Date().getFullYear() % 100;

          return year >= currentYear;
        },
        defaultMessage() {
          return 'Año de expiración inválido (debe ser 2 dígitos y no estar vencido)';
        },
      },
    });
  };
}

export function IsNotExpired(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotExpired',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as any;
          const month = parseInt(obj.exp_month, 10);
          const year = parseInt(obj.exp_year, 10) + 2000;

          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1;

          if (year < currentYear) return false;
          if (year === currentYear && month < currentMonth) return false;

          return true;
        },
        defaultMessage() {
          return 'La tarjeta está vencida';
        },
      },
    });
  };
}
