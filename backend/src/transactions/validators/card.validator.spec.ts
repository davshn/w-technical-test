import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import {
  IsCreditCard,
  IsVisaOrMastercard,
  IsCVV,
  IsValidExpMonth,
  IsValidExpYear,
  IsNotExpired,
} from './card.validator';

class TestCreditCardDto {
  @IsCreditCard()
  cardNumber: string;
}

class TestVisaOrMastercardDto {
  @IsVisaOrMastercard()
  cardNumber: string;
}

class TestCVVDto {
  @IsCVV()
  cvv: string;
}

class TestExpMonthDto {
  @IsValidExpMonth()
  expMonth: string;
}

class TestExpYearDto {
  @IsValidExpYear()
  expYear: string;
}

class TestNotExpiredDto {
  @IsValidExpMonth()
  exp_month: string;

  @IsValidExpYear()
  @IsNotExpired()
  exp_year: string;
}

describe('IsCreditCard Validator', () => {
  describe('Valid credit card numbers', () => {
    it('should accept valid Visa card', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: '4111111111111111',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept valid Mastercard', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: '5555555555554444',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept card number with spaces', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: '4111 1111 1111 1111',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept card number with dashes', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: '4111-1111-1111-1111',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept American Express card', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: '378282246310005',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept Discover card', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: '6011111111111117',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Invalid credit card numbers', () => {
    it('should reject invalid card number (fails Luhn)', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: '4111111111111112',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isCreditCard).toBe(
        'Número de tarjeta inválido',
      );
    });

    it('should reject card number with letters', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: '411111111111ABCD',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject too short card number', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: '4111',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject empty string', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: '',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject non-string value (number)', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: 4111111111111111 as any,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject null value', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: null as any,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject undefined value', async () => {
      const dto = plainToClass(TestCreditCardDto, {
        cardNumber: undefined as any,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

describe('IsVisaOrMastercard Validator', () => {
  describe('Valid Visa and Mastercard', () => {
    it('should accept Visa card', async () => {
      const dto = plainToClass(TestVisaOrMastercardDto, {
        cardNumber: '4111111111111111',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept another Visa card', async () => {
      const dto = plainToClass(TestVisaOrMastercardDto, {
        cardNumber: '4242424242424242',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept Mastercard', async () => {
      const dto = plainToClass(TestVisaOrMastercardDto, {
        cardNumber: '5555555555554444',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept another Mastercard', async () => {
      const dto = plainToClass(TestVisaOrMastercardDto, {
        cardNumber: '5105105105105100',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept Visa with spaces', async () => {
      const dto = plainToClass(TestVisaOrMastercardDto, {
        cardNumber: '4111 1111 1111 1111',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Invalid card types', () => {
    it('should reject American Express', async () => {
      const dto = plainToClass(TestVisaOrMastercardDto, {
        cardNumber: '378282246310005',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isVisaOrMastercard).toBe(
        'Solo se aceptan tarjetas Visa o Mastercard',
      );
    });

    it('should reject Discover card', async () => {
      const dto = plainToClass(TestVisaOrMastercardDto, {
        cardNumber: '6011111111111117',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject Diners Club card', async () => {
      const dto = plainToClass(TestVisaOrMastercardDto, {
        cardNumber: '30569309025904',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject invalid card number', async () => {
      const dto = plainToClass(TestVisaOrMastercardDto, {
        cardNumber: '1234567890123456',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject non-string value', async () => {
      const dto = plainToClass(TestVisaOrMastercardDto, {
        cardNumber: 4111111111111111 as any,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

describe('IsCVV Validator', () => {
  describe('Valid CVV', () => {
    it('should accept 3-digit CVV', async () => {
      const dto = plainToClass(TestCVVDto, { cvv: '123' });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept 4-digit CVV (AMEX)', async () => {
      const dto = plainToClass(TestCVVDto, { cvv: '1234' });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept CVV starting with zero', async () => {
      const dto = plainToClass(TestCVVDto, { cvv: '012' });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept all zeros', async () => {
      const dto = plainToClass(TestCVVDto, { cvv: '000' });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Invalid CVV', () => {
    it('should reject 2-digit CVV', async () => {
      const dto = plainToClass(TestCVVDto, { cvv: '12' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isCVV).toBe('CVV debe tener 3 o 4 dígitos');
    });

    it('should reject 5-digit CVV', async () => {
      const dto = plainToClass(TestCVVDto, { cvv: '12345' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject CVV with letters', async () => {
      const dto = plainToClass(TestCVVDto, { cvv: '12A' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject CVV with special characters', async () => {
      const dto = plainToClass(TestCVVDto, { cvv: '12-' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject empty string', async () => {
      const dto = plainToClass(TestCVVDto, { cvv: '' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject non-string value (number)', async () => {
      const dto = plainToClass(TestCVVDto, { cvv: 123 as any });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject CVV with spaces', async () => {
      const dto = plainToClass(TestCVVDto, { cvv: '1 23' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

describe('IsValidExpMonth Validator', () => {
  describe('Valid months', () => {
    it('should accept month 01', async () => {
      const dto = plainToClass(TestExpMonthDto, { expMonth: '01' });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept month 12', async () => {
      const dto = plainToClass(TestExpMonthDto, { expMonth: '12' });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept month 06', async () => {
      const dto = plainToClass(TestExpMonthDto, { expMonth: '06' });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept single digit month', async () => {
      const dto = plainToClass(TestExpMonthDto, { expMonth: '1' });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Invalid months', () => {
    it('should reject month 00', async () => {
      const dto = plainToClass(TestExpMonthDto, { expMonth: '00' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isValidExpMonth).toBe(
        'Mes de expiración inválido (debe estar entre 01 y 12)',
      );
    });

    it('should reject month 13', async () => {
      const dto = plainToClass(TestExpMonthDto, { expMonth: '13' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject month 99', async () => {
      const dto = plainToClass(TestExpMonthDto, { expMonth: '99' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject negative month', async () => {
      const dto = plainToClass(TestExpMonthDto, { expMonth: '-1' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject month with letters', async () => {
      const dto = plainToClass(TestExpMonthDto, { expMonth: 'AB' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject empty string', async () => {
      const dto = plainToClass(TestExpMonthDto, { expMonth: '' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject non-string value', async () => {
      const dto = plainToClass(TestExpMonthDto, { expMonth: 6 as any });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

describe('IsValidExpYear Validator', () => {
  const currentYear = new Date().getFullYear() % 100;

  describe('Valid years', () => {
    it('should accept current year', async () => {
      const dto = plainToClass(TestExpYearDto, {
        expYear: currentYear.toString().padStart(2, '0'),
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept next year', async () => {
      const nextYear = (currentYear + 1) % 100;
      const dto = plainToClass(TestExpYearDto, {
        expYear: nextYear.toString().padStart(2, '0'),
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept year in 5 years', async () => {
      const futureYear = (currentYear + 5) % 100;
      const dto = plainToClass(TestExpYearDto, {
        expYear: futureYear.toString().padStart(2, '0'),
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept year 99 (assuming future)', async () => {
      const dto = plainToClass(TestExpYearDto, { expYear: '99' });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Invalid years', () => {
    it('should reject last year', async () => {
      const lastYear = currentYear === 0 ? 99 : currentYear - 1;
      const dto = plainToClass(TestExpYearDto, {
        expYear: lastYear.toString().padStart(2, '0'),
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isValidExpYear).toBe(
        'Año de expiración inválido (debe ser 2 dígitos y no estar vencido)',
      );
    });

    it('should reject 4-digit year', async () => {
      const dto = plainToClass(TestExpYearDto, { expYear: '2025' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject 1-digit year', async () => {
      const dto = plainToClass(TestExpYearDto, { expYear: '5' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject 3-digit year', async () => {
      const dto = plainToClass(TestExpYearDto, { expYear: '025' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject year with letters', async () => {
      const dto = plainToClass(TestExpYearDto, { expYear: 'AB' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject empty string', async () => {
      const dto = plainToClass(TestExpYearDto, { expYear: '' });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should reject non-string value', async () => {
      const dto = plainToClass(TestExpYearDto, { expYear: 25 as any });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});

describe('IsNotExpired Validator', () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  describe('Valid (not expired) dates', () => {
    it('should accept card expiring next year', async () => {
      const nextYear = (currentYear + 1) % 100;
      const dto = plainToClass(TestNotExpiredDto, {
        exp_month: '01',
        exp_year: nextYear.toString().padStart(2, '0'),
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept card expiring in 5 years', async () => {
      const futureYear = (currentYear + 5) % 100;
      const dto = plainToClass(TestNotExpiredDto, {
        exp_month: '12',
        exp_year: futureYear.toString().padStart(2, '0'),
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept card expiring this year but future month', async () => {
      const futureMonth = currentMonth === 12 ? 12 : currentMonth + 1;
      const dto = plainToClass(TestNotExpiredDto, {
        exp_month: futureMonth.toString().padStart(2, '0'),
        exp_year: currentYear.toString().padStart(2, '0'),
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should accept card expiring current month', async () => {
      const dto = plainToClass(TestNotExpiredDto, {
        exp_month: currentMonth.toString().padStart(2, '0'),
        exp_year: currentYear.toString().padStart(2, '0'),
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('Invalid (expired) dates', () => {
    it('should reject card expired last year', async () => {
      const lastYear = currentYear === 0 ? 99 : currentYear - 1;
      const dto = plainToClass(TestNotExpiredDto, {
        exp_month: '12',
        exp_year: lastYear.toString().padStart(2, '0'),
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      const expiredError = errors.find((e) => e.constraints?.isNotExpired);
      expect(expiredError?.constraints?.isNotExpired).toBe(
        'La tarjeta está vencida',
      );
    });

    it('should reject card expired this year but past month', async () => {
      if (currentMonth > 1) {
        const pastMonth = currentMonth - 1;
        const dto = plainToClass(TestNotExpiredDto, {
          exp_month: pastMonth.toString().padStart(2, '0'),
          exp_year: currentYear.toString().padStart(2, '0'),
        });

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
      }
    });

    it('should reject card expired 5 years ago', async () => {
      const pastYear =
        currentYear >= 5 ? currentYear - 5 : 100 - (5 - currentYear);
      const dto = plainToClass(TestNotExpiredDto, {
        exp_month: '01',
        exp_year: pastYear.toString().padStart(2, '0'),
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle year rollover correctly', async () => {
      const dto = plainToClass(TestNotExpiredDto, {
        exp_month: '12',
        exp_year: '99',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should validate month and year together', async () => {
      const lastYear = currentYear === 0 ? 99 : currentYear - 1;
      const dto = plainToClass(TestNotExpiredDto, {
        exp_month: '00',
        exp_year: lastYear.toString().padStart(2, '0'),
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
