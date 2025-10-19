import { CardFormData } from '../../molecule/AddCardModalMol/AddCardModalProps'

export interface CartItemType {
  id: number
  name: string
  uri: string
  description: string
  quantity: number
  value: number
}

export interface AvailableProduct {
  id: number
  quantity: number
}

export interface PaymentMethod {
  lastFourDigits: string
  cardType: 'VISA' | 'MASTERCARD'
}

export interface CartOrgProps {
  items: CartItemType[]
  availableProducts: AvailableProduct[]
  subtotal: number
  tax?: number
  discount?: number
  shipping?: number
  total: number
  paymentMethod?: PaymentMethod
  termsUrl?: string
  onQuantityChange?: (id: number, quantity: number) => void
  onRemoveItem?: (id: number) => void
  onAddPaymentMethod?: () => void
  onCheckout?: () => void
  responsive?: boolean
  emptyMessage?: string
  emptyDescription?: string
  testID?: string
  handleCardAdded?: (cardData: CardFormData) => Promise<void>
  showPaymentModal?: boolean
  setShowPaymentModal?: (visible: boolean) => void
}