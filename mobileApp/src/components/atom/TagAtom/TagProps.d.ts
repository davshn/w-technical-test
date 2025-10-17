import type { PressableProps, ViewStyle, TextStyle } from 'react-native'

export type TagSize = 'xs' | 'sm' | 'base' | 'lg'

export type TagVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'outline'

export type TagShape = 'rounded' | 'pill' | 'square'

type BasePressableProps = Omit<PressableProps, 'style' | 'children'>

export interface TagAtomProps extends BasePressableProps {
  label: string
  size?: TagSize
  variant?: TagVariant
  shape?: TagShape
  responsive?: boolean
  pressable?: boolean
  onPress?: () => void
  onClose?: () => void
  disabled?: boolean
  icon?: React.ReactNode
  closeIcon?: React.ReactNode
  style?: ViewStyle | ViewStyle[]
  textStyle?: TextStyle | TextStyle[]
  testID?: string
}
