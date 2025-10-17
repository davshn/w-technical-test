import type { ViewStyle } from 'react-native'

export type StepperInputSize = 'sm' | 'base' | 'lg'

export type StepperInputVariant = 'default' | 'outlined' | 'filled'

export type StepperInputShape = 'square' | 'rounded' | 'circular'

export interface StepperInputProps {
  value: number
  onChange: (value: number) => void
  size?: StepperInputSize
  variant?: StepperInputVariant
  shape?: StepperInputShape
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  editable?: boolean
  responsive?: boolean
  showValue?: boolean
  decrementIcon?: React.ReactNode
  incrementIcon?: React.ReactNode
  prefix?: string
  suffix?: string
  formatValue?: (value: number) => string
  onMinReached?: () => void
  onMaxReached?: () => void
  style?: ViewStyle | ViewStyle[]
  testID?: string
}
