import type { ViewStyle } from 'react-native'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export type ToastPosition = 'top' | 'bottom' | 'center'

export type ToastSize = 'sm' | 'base' | 'lg'

export interface ToastBaseProps {
  message: string
  variant?: ToastVariant
  position?: ToastPosition
  size?: ToastSize
  duration?: number
  visible?: boolean
  onHide?: () => void
  onPress?: () => void
  icon?: React.ReactNode
  closeIcon?: React.ReactNode
  showCloseButton?: boolean
  responsive?: boolean
  style?: ViewStyle | ViewStyle[]
  testID?: string
}
