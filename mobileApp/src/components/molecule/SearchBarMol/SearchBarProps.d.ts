import type { TextInputProps } from 'react-native'
import type { TextInputSize, TextInputVariant } from '@/src/components/atoms/TextInput/TextInputProps'

export interface SearchBarProps extends Omit<TextInputProps, 'value' | 'onChangeText' | 'style'> {
  value: string
  onChangeText?: (text: string) => void
  onSearch?: (query: string) => void
  onClear?: () => void
  onFocus?: (e: any) => void
  onBlur?: (e: any) => void
  placeholder?: string
  size?: TextInputSize
  variant?: TextInputVariant
  loading?: boolean
  disabled?: boolean
  showSearchButton?: boolean
  autoFocus?: boolean
  clearOnSearch?: boolean
  debounceTime?: number
  responsive?: boolean
  containerStyle?: ViewStyle | ViewStyle[]
  testID?: string
  SearchIconComponent?: React.ComponentType<{ size: number; color: string }>
  ClearIconComponent?: React.ComponentType<{ size: number; color: string }>
}