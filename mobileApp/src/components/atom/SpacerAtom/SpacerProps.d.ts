import type { ViewProps } from 'react-native'

export type SpacerSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'

export type SpacerDirection = 'horizontal' | 'vertical'

export interface SpacerAtomProps extends Omit<ViewProps, 'style'> {
  size?: SpacerSize
  direction?: SpacerDirection
  customSize?: number
  responsive?: boolean
  flex?: number
  testID?: string
}
