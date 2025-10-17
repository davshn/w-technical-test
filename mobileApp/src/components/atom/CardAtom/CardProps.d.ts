import type { ViewStyle, PressableProps } from 'react-native'

export type CardVariant = 'elevated' | 'outlined' | 'filled' | 'ghost'

export type CardPadding = 'none' | 'xs' | 'sm' | 'base' | 'lg' | 'xl'

export type CardRadius = 'none' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'full'

export type CardShadow = 'none' | 'sm' | 'base' | 'lg' | 'xl'

type BasePressableProps = Omit<PressableProps, 'style' | 'children'>

export interface CardAtomProps extends BasePressableProps {
  variant?: CardVariant
  padding?: CardPadding
  radius?: CardRadius
  shadow?: CardShadow
  shadowColor?: string
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  responsive?: boolean
  pressable?: boolean
  onPress?: () => void
  onLongPress?: () => void
  activeOpacity?: number
  disabled?: boolean
  style?: ViewStyle | ViewStyle[]
  children?: React.ReactNode
  testID?: string
}
