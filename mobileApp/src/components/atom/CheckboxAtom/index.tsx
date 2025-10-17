import {
  PixelRatio,
  Pressable,
  View,
  ViewStyle,
  Text,
  StyleSheet,
} from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type { CheckboxAtomProps, CheckboxSize } from './CheckboxProps'

const checkboxSizes: Record<
  CheckboxSize,
  {
    size: number
    iconSize: number
    borderWidth: number
    borderRadius: number
  }
> = {
  sm: {
    size: 16,
    iconSize: 10,
    borderWidth: 1.5,
    borderRadius: 3,
  },
  base: {
    size: 20,
    iconSize: 12,
    borderWidth: 2,
    borderRadius: 4,
  },
  lg: {
    size: 24,
    iconSize: 16,
    borderWidth: 2,
    borderRadius: 5,
  },
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.05,
}

const getResponsiveCheckboxSize = (
  size: CheckboxSize,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  const baseConfig = checkboxSizes[size]

  if (!responsive) return baseConfig

  let multiplier = mobileAdjustments.regular

  if (isSmallPhone) {
    multiplier = mobileAdjustments.small
  } else if (isLargePhone) {
    multiplier = mobileAdjustments.large
  }

  return {
    size: PixelRatio.roundToNearestPixel(baseConfig.size * multiplier),
    iconSize: PixelRatio.roundToNearestPixel(baseConfig.iconSize * multiplier),
    borderWidth: Math.max(1, Math.round(baseConfig.borderWidth * multiplier)),
    borderRadius: PixelRatio.roundToNearestPixel(
      baseConfig.borderRadius * multiplier,
    ),
  }
}

const CheckIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <View
    style={{
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width: size * 0.8,
        height: size * 0.4,
        borderLeftWidth: size * 0.15,
        borderBottomWidth: size * 0.15,
        borderLeftColor: color,
        borderBottomColor: color,
        transform: [{ rotate: '-45deg' }, { translateY: -size * 0.1 }],
      }}
    />
  </View>
)

const IndeterminateIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <View
    style={{
      width: size * 0.6,
      height: size * 0.15,
      backgroundColor: color,
      borderRadius: size * 0.075,
    }}
  />
)

export const Checkbox: React.FC<CheckboxAtomProps> = ({
  size = 'base',
  variant = 'default',
  state = 'default',
  shape = 'rounded',
  responsive = false,
  style,
  testID,
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  description,
  onPress,
  checkedIcon,
  indeterminateIcon,
  hitSlop = { top: 8, bottom: 8, left: 8, right: 8 },
  ...rest
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()

  const currentState = disabled
    ? 'disabled'
    : indeterminate
      ? 'indeterminate'
      : state
  const isChecked = indeterminate || checked

  const responsiveSize = getResponsiveCheckboxSize(
    size,
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  const textColor = useThemeColor({}, 'textPrimary')
  const descriptionColor = useThemeColor({}, 'textSecondary')
  const disabledTextColor = useThemeColor({}, 'disabled')

  const getCheckboxColors = () => {
    const checkedBackgroundColors = {
      default: useThemeColor({}, 'background'),
      success: useThemeColor({}, 'success'),
      warning: useThemeColor({}, 'warning'),
      error: useThemeColor({}, 'error'),
      transparent: useThemeColor({}, 'transparent'),
    }

    const borderColors = {
      default: useThemeColor({}, 'primary'),
      success: useThemeColor({}, 'success'),
      warning: useThemeColor({}, 'warning'),
      error: useThemeColor({}, 'error'),
    }

    const disabledColor = {
      backgroundColor: isChecked
        ? useThemeColor({}, 'disabled')
        : useThemeColor({}, 'transparent'),
      borderColor: useThemeColor({}, 'disabled'),
      iconColor: useThemeColor({}, 'disabled'),
    }
    const iconColor = useThemeColor({}, 'tint')

    const color = {
      backgroundColor: isChecked
        ? checkedBackgroundColors[variant]
        : checkedBackgroundColors.transparent,
      borderColor: borderColors[variant],
      iconColor: iconColor,
    }

    if (currentState === 'disabled') {
      return disabledColor
    }

    return color
  }

  const handlePress = () => {
    if (!disabled && onPress) {
      if (indeterminate) {
        onPress(true)
      } else {
        onPress(!checked)
      }
    }
  }

  const colors = getCheckboxColors()

  const getBorderRadius = () => {
    if (shape === 'square') return 0
    return responsiveSize.borderRadius
  }

  const checkboxStyle: ViewStyle = {
    width: responsiveSize.size,
    height: responsiveSize.size,
    borderWidth: responsiveSize.borderWidth,
    borderColor: colors.borderColor,
    borderRadius: getBorderRadius(),
    backgroundColor: colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: currentState === 'disabled' ? 0.5 : 1,
  }

  const renderIcon = () => {
    if (currentState === 'indeterminate' || indeterminate) {
      return (
        indeterminateIcon ?? (
          <IndeterminateIcon
            size={responsiveSize.iconSize}
            color={colors.iconColor}
          />
        )
      )
    }

    if (checked) {
      return (
        checkedIcon ?? (
          <CheckIcon size={responsiveSize.iconSize} color={colors.iconColor} />
        )
      )
    }

    return null
  }

  const finalStyles = { ...checkboxStyle, ...style }

  if (label || description) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        hitSlop={hitSlop}
        testID={testID}
        accessible={true}
        accessibilityRole="checkbox"
        accessibilityLabel={label}
        accessibilityHint={description}
        accessibilityState={{
          disabled: disabled,
          checked: indeterminate ? 'mixed' : checked,
        }}
        style={({ pressed }) => [
          styles.container,
          pressed && !disabled && styles.pressed,
        ]}
        {...rest}
      >
        <View
          style={[finalStyles, { marginRight: label || description ? 12 : 0 }]}
        >
          {renderIcon()}
        </View>

        {(label ?? description) && (
          <View style={styles.textContainer}>
            {label && (
              <Text
                style={[
                  styles.label,
                  {
                    color: disabled ? disabledTextColor : textColor,
                    fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
                  },
                ]}
              >
                {label}
              </Text>
            )}
            {description && (
              <Text
                style={[
                  styles.description,
                  {
                    color: disabled ? disabledTextColor : descriptionColor,
                    fontSize: size === 'sm' ? 12 : size === 'lg' ? 14 : 13,
                  },
                ]}
              >
                {description}
              </Text>
            )}
          </View>
        )}
      </Pressable>
    )
  }

  // Sin label ni description, renderizar solo el checkbox
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={hitSlop}
      testID={testID}
      accessible={true}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{
        disabled: disabled,
        checked: indeterminate ? 'mixed' : checked,
      }}
      style={({ pressed }) =>
        Object.assign(
          {},
          pressed &&
            !disabled && {
              transform: [{ scale: 0.95 }],
            },
          finalStyles,
        )
      }
      {...rest}
    >
      {renderIcon()}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pressed: {
    opacity: 0.7,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontWeight: '500',
    lineHeight: 20,
  },
  description: {
    marginTop: 2,
    lineHeight: 18,
  },
})
