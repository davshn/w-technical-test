import {
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type {
  StepperInputProps,
  StepperInputShape,
  StepperInputSize,
} from './StepperInputProps'

const stepperSizes: Record<
  StepperInputSize,
  {
    height: number
    width: number
    fontSize: number
    iconSize: number
    buttonSize: number
  }
> = {
  sm: {
    height: 32,
    width: 100,
    fontSize: 14,
    iconSize: 14,
    buttonSize: 32,
  },
  base: {
    height: 40,
    width: 120,
    fontSize: 16,
    iconSize: 16,
    buttonSize: 40,
  },
  lg: {
    height: 48,
    width: 140,
    fontSize: 18,
    iconSize: 18,
    buttonSize: 48,
  },
}

const stepperShapes: Record<StepperInputShape, number> = {
  square: 0,
  rounded: 8,
  circular: 9999,
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.05,
}

const getResponsiveStepperSize = (
  size: StepperInputSize,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  const baseConfig = stepperSizes[size]

  if (!responsive) {
    return baseConfig
  }

  let multiplier = mobileAdjustments.regular

  if (isSmallPhone) {
    multiplier = mobileAdjustments.small
  } else if (isLargePhone) {
    multiplier = mobileAdjustments.large
  }

  return {
    height: PixelRatio.roundToNearestPixel(baseConfig.height * multiplier),
    width: PixelRatio.roundToNearestPixel(baseConfig.width * multiplier),
    fontSize: PixelRatio.roundToNearestPixel(baseConfig.fontSize * multiplier),
    iconSize: PixelRatio.roundToNearestPixel(baseConfig.iconSize * multiplier),
    buttonSize: PixelRatio.roundToNearestPixel(
      baseConfig.buttonSize * multiplier,
    ),
  }
}

export const StepperInput: React.FC<StepperInputProps> = ({
  value,
  onChange,
  size = 'base',
  variant = 'default',
  shape = 'rounded',
  min = 0,
  max = Infinity,
  step = 1,
  disabled = false,
  editable = false,
  responsive = false,
  showValue = true,
  decrementIcon,
  incrementIcon,
  prefix,
  suffix,
  formatValue,
  style,
  testID,
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()

  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({}, 'primary')
  const textColor = useThemeColor({}, 'textPrimary')
  const disabledColor = useThemeColor({}, 'disabled')
  const buttonBackground = useThemeColor({}, 'tint')

  const responsiveSize = getResponsiveStepperSize(
    size,
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  const normalizeValue = (val: number): number => {
    let normalized = val

    if (normalized < min) {
      normalized = min
    }

    if (normalized > max) {
      normalized = max
    }

    return normalized
  }

  const handleDecrement = () => {
    if (disabled) return

    const newValue = value - step
    const normalized = normalizeValue(newValue)
    onChange(normalized)
  }

  const handleIncrement = () => {
    if (disabled) return

    const newValue = value + step
    const normalized = normalizeValue(newValue)
    onChange(normalized)
  }

  const handleTextChange = (text: string) => {
    if (disabled || !editable) return

    const cleanText = text.replace(/[^0-9.-]/g, '')
    const numValue = parseFloat(cleanText)

    if (!isNaN(numValue)) {
      const normalized = normalizeValue(numValue)
      onChange(normalized)
    } else if (cleanText === '' || cleanText === '-') {
      onChange(min)
    }
  }

  const formatDisplayValue = (): string => {
    let displayValue = formatValue ? formatValue(value) : value.toString()

    if (prefix) displayValue = `${prefix}${displayValue}`
    if (suffix) displayValue = `${displayValue}${suffix}`

    return displayValue
  }

  const isDecrementDisabled = disabled || value <= min
  const isIncrementDisabled = disabled || value >= max

  const getContainerStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      height: responsiveSize.height,
      borderRadius: stepperShapes[shape],
      overflow: 'hidden',
    }

    if (variant === 'outlined') {
      return {
        ...baseStyles,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? disabledColor : borderColor,
      }
    }

    if (variant === 'filled') {
      return {
        ...baseStyles,
        backgroundColor: disabled ? disabledColor : backgroundColor,
      }
    }

    return {
      ...baseStyles,
      backgroundColor: disabled ? disabledColor : backgroundColor,
      borderWidth: 1,
      borderColor: disabled ? disabledColor : borderColor,
    }
  }

  const getButtonStyles = (isDisabled: boolean): ViewStyle => ({
    width: responsiveSize.buttonSize,
    height: responsiveSize.height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      variant === 'filled' || variant === 'default'
        ? isDisabled
          ? disabledColor
          : buttonBackground
        : 'transparent',
  })

  const getValueContainerStyles = (): ViewStyle => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  })

  const getTextStyles = (): TextStyle => ({
    fontSize: responsiveSize.fontSize,
    color: disabled ? disabledColor : textColor,
    fontWeight: '600',
    textAlign: 'center',
  })

  const containerStyles = { ...getContainerStyles(), ...style }

  return (
    <View style={containerStyles} testID={testID}>
      <Pressable
        onPress={handleDecrement}
        disabled={isDecrementDisabled}
        style={({ pressed }) =>
          Object.assign(
            {},
            getButtonStyles(isDecrementDisabled),
            pressed && !isDecrementDisabled && styles.pressed,
          )
        }
        testID={testID ? `${testID}-decrement` : undefined}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Decrease value"
        accessibilityState={{ disabled: isDecrementDisabled }}
      >
        {decrementIcon ?? (
          <Text
            style={Object.assign({}, getTextStyles(), {
              fontSize: responsiveSize.iconSize + 4,
            })}
          >
            −
          </Text>
        )}
      </Pressable>

      {showValue && (
        <View style={getValueContainerStyles()}>
          {editable ? (
            <TextInput
              value={formatDisplayValue()}
              onChangeText={handleTextChange}
              keyboardType="numeric"
              editable={!disabled}
              style={Object.assign({}, getTextStyles(), {
                width: '100%',
                padding: 0,
                margin: 0,
              })}
              testID={testID ? `${testID}-input` : undefined}
              accessible={true}
              accessibilityLabel="Stepper value"
              accessibilityValue={{ now: value, min, max }}
            />
          ) : (
            <Text
              style={getTextStyles()}
              testID={testID ? `${testID}-value` : undefined}
            >
              {formatDisplayValue()}
            </Text>
          )}
        </View>
      )}

      <Pressable
        onPress={handleIncrement}
        disabled={isIncrementDisabled}
        style={({ pressed }) =>
          Object.assign(
            {},
            getButtonStyles(isIncrementDisabled),
            pressed && !isIncrementDisabled && styles.pressed,
          )
        }
        testID={testID ? `${testID}-increment` : undefined}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Increase value"
        accessibilityState={{ disabled: isIncrementDisabled }}
      >
        {incrementIcon ?? (
          <Text
            style={Object.assign({}, getTextStyles(), {
              fontSize: responsiveSize.iconSize + 4,
            })}
          >
            +
          </Text>
        )}
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
})
