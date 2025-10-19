export interface CardFormData {
  number: string
  cvc: string
  exp_month: string
  exp_year: string
  card_holder: string
  email: string
}

export interface CardFormErrors {
  number?: string
  cvc?: string
  exp_month?: string
  exp_year?: string
  card_holder?: string
  email?: string
}

export interface AddCardModalProps {
  visible: boolean
  onClose: () => void
  onAddCard: (cardData: CardFormData) => Promise<void>
  termsUrl?: string
  responsive?: boolean
  testID?: string
}