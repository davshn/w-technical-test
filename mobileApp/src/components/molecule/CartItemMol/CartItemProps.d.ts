export interface CartItem {
  id: number
  name: string
  uri: string
  description: string
  quantity: number
  value: number
}

export interface CartItemMolProps {
  item: CartItem
  availableStock: number
  onQuantityChange?: (id: number, quantity: number) => void
  onRemove?: (id: number) => void
  responsive?: boolean
  showImage?: boolean
  testID?: string
}