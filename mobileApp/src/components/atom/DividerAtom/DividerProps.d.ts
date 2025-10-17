import type { ViewStyle } from 'react-native'

export type DividerOrientation = 'horizontal' | 'vertical'

export type DividerVariant = 'solid' | 'dashed' | 'dotted'

export type DividerThickness = 'thin' | 'base' | 'thick'

export type DividerSpacing = 'none' | 'xs' | 'sm' | 'base' | 'lg' | 'xl'

export interface DividerAtomProps {
  orientation?: DividerOrientation
  variant?: DividerVariant
  thickness?: DividerThickness
  spacing?: DividerSpacing
  color?: string
  length?: number | string
  responsive?: boolean
  style?: ViewStyle | ViewStyle[]
  testID?: string
}
