import type { ActivityIndicatorProps } from 'react-native'

export type ActivityIndicatorSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'

export type ActivityIndicatorVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'light'
  | 'dark'

export interface ActivityIndicatorAtomProps
  extends Omit<ActivityIndicatorProps, 'size' | 'color'> {
  size?: ActivityIndicatorSize
  variant?: ActivityIndicatorVariant
  color?: string
  responsive?: boolean
  overlay?: boolean
  overlayColor?: string
  style?: ViewStyle | ViewStyle[]
  containerStyle?: ViewStyle | ViewStyle[]
  testID?: string
}
