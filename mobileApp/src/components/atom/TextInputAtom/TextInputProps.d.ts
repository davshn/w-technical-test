import type { TextStyle, ViewStyle, TextInputProps } from 'react-native'

export type TextInputSize = 'sm' | 'base' | 'lg'

export type TextInputVariant =
  | 'outlined'
  | 'filled'
  | 'underlined'
  | 'borderless'

export type TextInputState = 'default' | 'focused' | 'error' | 'disabled'

export interface TextInputAtomProps extends Omit<TextInputProps, 'style'> {
  size?: TextInputSize
  variant?: TextInputVariant
  state?: TextInputState
  responsive?: boolean
  containerStyle?: ViewStyle | ViewStyle[]
  inputStyle?: TextStyle | TextStyle[]
  testID?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconPress?: () => void
  onLeftIconPress?: () => void
}
