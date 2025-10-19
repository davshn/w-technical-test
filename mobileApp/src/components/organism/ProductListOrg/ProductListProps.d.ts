import type { Product } from '@/src/components/molecules/ProductCard/ProductCardProps'

export interface ProductListProps {
  products?: Product[]
  loading?: boolean
  onSearch?: (query: string) => void | Promise<void>
  onRefresh?: () => void | Promise<void>
  onProductPress?: (product: Product) => void
  skeletonCount?: number
  emptyMessage?: string
  searchPlaceholder?: string
  responsive?: boolean
  testID?: string
}