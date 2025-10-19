
export interface PaymentMethod {
  lastFourDigits: string
  cardType: 'VISA' | 'MASTERCARD'
}

export interface CartSummaryMolProps {
  subtotal: number
  tax?: number
  discount?: number
  shipping?: number
  total: number
  itemCount: number
  currency?: string
  responsive?: boolean
  showItemCount?: boolean
  paymentMethod?: PaymentMethod
  onAddPaymentMethod?: () => void
  onCheckout?: () => void
  testID?: string
}