import type { ViewStyle, TextStyle } from 'react-native'

export type BadgeSize = 'xs' | 'sm' | 'base' | 'lg'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export type BadgeShape = 'rounded' | 'square' | 'pill'

export type BadgeStyle = 'solid' | 'outline' | 'subtle'

export interface BadgeAtomProps {
  size?: BadgeSize
  variant?: BadgeVariant
  shape?: BadgeShape
  badgeStyle?: BadgeStyle
  responsive?: boolean
  style?: ViewStyle | ViewStyle[]
  textStyle?: TextStyle | TextStyle[]
  testID?: string
  children?: React.ReactNode
  label?: string
  count?: number
  maxCount?: number
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  icon?: React.ReactNode
  showDot?: boolean
  accessibilityLabel?: string
  accessibilityHint?: string
}
