export interface ProductDetailModalProps {
  visible: boolean
  product: Product | null
  onClose?: () => void
  onAddToCart?: (product: Product) => void
  responsive?: boolean
  testID?: string
}