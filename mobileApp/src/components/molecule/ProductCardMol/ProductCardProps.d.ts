export interface Product {
  id: number
  name: string
  uri: string
  description: string
  quantity: number
  value: number
}

export interface ProductCardProps {
  product: Product
  onPress?: (product: Product) => void
  imageAspectRatio?: '4:3' | '16:9' | 'square'
  showStock?: boolean
  compact?: boolean
  responsive?: boolean
  testID?: string
}