import {
  PixelRatio,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type {
  CardAtomProps,
  CardPadding,
  CardRadius,
  CardShadow,
} from './CardProps'

const paddingValues: Record<CardPadding, number> = {
  none: 0,
  xs: 8,
  sm: 12,
  base: 16,
  lg: 20,
  xl: 24,
}

const radiusValues: Record<CardRadius, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  base: 12,
  lg: 16,
  xl: 20,
  full: 9999,
}

const shadowValues: Record<
  CardShadow,
  {
    shadowOffset: { width: number; height: number }
    shadowOpacity: number
    shadowRadius: number
    elevation: number
  }
> = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  base: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  xl: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.1,
}

const getResponsiveValue = (
  value: number,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  if (!responsive || value === 0) {
    return value
  }

  let multiplier = mobileAdjustments.regular

  if (isSmallPhone) {
    multiplier = mobileAdjustments.small
  } else if (isLargePhone) {
    multiplier = mobileAdjustments.large
  }

  return PixelRatio.roundToNearestPixel(value * multiplier)
}

export const Card: React.FC<CardAtomProps> = ({
  variant = 'elevated',
  padding = 'base',
  radius = 'base',
  shadow = 'base',
  shadowColor,
  backgroundColor,
  borderColor,
  borderWidth,
  responsive = false,
  pressable = false,
  onPress,
  onLongPress,
  activeOpacity = 0.7,
  disabled = false,
  style,
  children,
  testID,
  ...rest
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()

  const cardBackground = useThemeColor({}, 'background')
  const elevatedBackground = useThemeColor({}, 'tint')
  const outlinedBorder = useThemeColor({}, 'primary')
  const defaultShadowColor = useThemeColor({}, 'secondary')
  const ghostBackground = useThemeColor({}, 'white')

  const isInteractive = pressable || !!onPress || !!onLongPress

  const responsivePadding = getResponsiveValue(
    paddingValues[padding],
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  const responsiveRadius = getResponsiveValue(
    radiusValues[radius],
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: backgroundColor ?? elevatedBackground,
          ...shadowValues[shadow],
          shadowColor: shadowColor ?? defaultShadowColor,
        }
      case 'outlined':
        return {
          backgroundColor: backgroundColor ?? 'transparent',
          borderWidth: borderWidth ?? 1,
          borderColor: borderColor ?? outlinedBorder,
        }
      case 'filled':
        return {
          backgroundColor: backgroundColor ?? cardBackground,
        }
      case 'ghost':
        return {
          backgroundColor: backgroundColor ?? ghostBackground,
        }
      default:
        return {}
    }
  }

  const cardStyles: ViewStyle = {
    ...getVariantStyles(),
    padding: responsivePadding,
    borderRadius: responsiveRadius,
    overflow: 'hidden',
  }

  const finalStyles = { ...cardStyles, ...style }

  if (isInteractive) {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        disabled={disabled}
        style={({ pressed }) =>
          Object.assign(
            {},
            pressed && !disabled && styles.pressed,
            disabled && styles.disabled,
            finalStyles,
          )
        }
        testID={testID}
        accessible={true}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        {...rest}
      >
        {children}
      </Pressable>
    )
  }

  return (
    <View
      style={finalStyles}
      testID={testID}
      accessible={true}
      accessibilityRole="none"
      {...rest}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.5,
  },
})
