import type { ViewStyle } from 'react-native'

export type CheckboxSize = 'sm' | 'base' | 'lg'

export type CheckboxVariant = 'default' | 'success' | 'warning' | 'error'

export type CheckboxState = 'default' | 'disabled' | 'indeterminate'

export type CheckboxShape = 'square' | 'rounded'

export interface CheckboxAtomProps {
  size?: CheckboxSize
  variant?: CheckboxVariant
  state?: CheckboxState
  shape?: CheckboxShape
  responsive?: boolean
  style?: ViewStyle | ViewStyle[]
  testID?: string
  checked?: boolean
  indeterminate?: boolean
  disabled?: boolean
  label?: string
  description?: string
  onPress?: (checked: boolean) => void
  checkedIcon?: React.ReactNode
  indeterminateIcon?: React.ReactNode
  hitSlop?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}
