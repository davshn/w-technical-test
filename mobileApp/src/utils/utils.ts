import * as cardValidator from 'card-validator'

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}


export function IsCreditCard(number: string) {
  const cleanValue = number.replace(/[\s-]/g, '')
  const validation = cardValidator.number(cleanValue);
  return validation.isValid;
}