import type { ViewProps, DimensionValue } from 'react-native'

export type ViewVariant =
  | 'default'
  | 'card'
  | 'elevated'
  | 'outlined'
  | 'transparent'

export type ViewPadding = 'none' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'

export type ViewMargin = 'none' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'

export type ViewRadius = 'none' | 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'full'

export type ViewShadow = 'none' | 'sm' | 'base' | 'lg' | 'xl'

export interface ViewAtomProps extends ViewProps {
  variant?: ViewVariant
  padding?: ViewPadding
  paddingVertical?: ViewPadding
  paddingHorizontal?: ViewPadding
  paddingTop?: ViewPadding
  paddingBottom?: ViewPadding
  paddingLeft?: ViewPadding
  paddingRight?: ViewPadding
  margin?: ViewMargin
  marginVertical?: ViewMargin
  marginHorizontal?: ViewMargin
  marginTop?: ViewMargin
  marginBottom?: ViewMargin
  marginLeft?: ViewMargin
  marginRight?: ViewMargin
  radius?: ViewRadius
  shadow?: ViewShadow
  shadowColor?: string
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  responsive?: boolean
  flex?: number
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  alignSelf?:
    | 'auto'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'stretch'
    | 'baseline'
  width?: DimensionValue
  height?: DimensionValue
  testID?: string
}
