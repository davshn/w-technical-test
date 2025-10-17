import type { ViewStyle, TextStyle, PressableProps } from 'react-native'

export type ButtonSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'success'
  | 'warning'
  | 'error'
  | 'fab'
  | 'icon'

export type ButtonState = 'default' | 'loading' | 'disabled'

export type ButtonShape = 'rounded' | 'square' | 'circle'

export interface ButtonAtomProps
  extends Omit<PressableProps, 'style' | 'children'> {
  size?: ButtonSize
  variant?: ButtonVariant
  state?: ButtonState
  shape?: ButtonShape
  responsive?: boolean
  style?: ViewStyle | ViewStyle[]
  textStyle?: TextStyle | TextStyle[]
  testID?: string
  title?: string
  children?: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  icon?: React.ReactNode
  loading?: boolean
  loadingText?: string
  loadingIcon?: React.ReactNode
  accessibilityLabel?: string
  accessibilityHint?: string
  disabled?: boolean
  onPress?: () => void
  onLongPress?: () => void
  hapticFeedback?: boolean
}
