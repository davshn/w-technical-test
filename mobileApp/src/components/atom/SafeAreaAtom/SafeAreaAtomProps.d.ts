import type { ViewProps } from 'react-native'

export type SafeAreaVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'transparent'

export type SafeAreaMode = 'padding' | 'margin'

export type SafeAreaEdges = 'top' | 'bottom' | 'left' | 'right'

export interface SafeAreaAtomProps extends ViewProps {
  variant?: SafeAreaVariant
  edges?: SafeAreaEdges[]
  mode?: SafeAreaMode
  backgroundColor?: string
  statusBarColor?: string
  statusBarStyle?: 'default' | 'light-content' | 'dark-content'
  includeStatusBar?: boolean
  flex?: number
  testID?: string
  style?: {}
}
