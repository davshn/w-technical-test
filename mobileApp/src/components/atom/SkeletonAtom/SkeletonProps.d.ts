import type { ViewStyle } from 'react-native'

export type SkeletonVariant = 'rect' | 'circle' | 'text'

export type SkeletonSize = 'sm' | 'base' | 'lg' | 'xl'

export interface SkeletonProps {
  variant?: SkeletonVariant
  size?: SkeletonSize
  width?: DimensionValue
  height?: DimensionValue
  borderRadius?: number
  lines?: number
  lineSpacing?: number
  lastLineWidth?: number | string
  animated?: boolean
  backgroundColor?: string
  highlightColor?: string
  animationDuration?: number
  responsive?: boolean
  style?: ViewStyle | ViewStyle[]
  testID?: string
}
