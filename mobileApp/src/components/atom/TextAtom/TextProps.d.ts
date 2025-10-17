import type { TextProps, TextStyle } from 'react-native'

export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'

export type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold'

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'muted'
  | 'white'

export type TextAlign = 'left' | 'center' | 'right' | 'justify'

export interface TextAtomProps extends Omit<TextProps, 'style'> {
  children: React.ReactNode
  size?: TextSize
  weight?: FontWeight
  color?: TextColor
  align?: TextAlign
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  style?: TextStyle | TextStyle[]
  testID?: string
  responsive?: boolean
}
