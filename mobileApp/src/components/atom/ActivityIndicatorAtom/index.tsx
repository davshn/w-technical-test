import {
  PixelRatio,
  ActivityIndicator as RNActivityIndicator,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type {
  ActivityIndicatorAtomProps,
  ActivityIndicatorSize,
  ActivityIndicatorVariant,
} from './ActivityIndicatorProps'

const indicatorSizes: Record<ActivityIndicatorSize, number> = {
  xs: 12,
  sm: 16,
  base: 24,
  lg: 32,
  xl: 48,
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.1,
}

const getResponsiveIndicatorSize = (
  size: ActivityIndicatorSize,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  const baseSize = indicatorSizes[size]

  if (!responsive) {
    return baseSize
  }

  let multiplier = mobileAdjustments.regular

  if (isSmallPhone) {
    multiplier = mobileAdjustments.small
  } else if (isLargePhone) {
    multiplier = mobileAdjustments.large
  }

  return PixelRatio.roundToNearestPixel(baseSize * multiplier)
}

export const ActivityIndicator: React.FC<ActivityIndicatorAtomProps> = ({
  size = 'base',
  variant = 'primary',
  color,
  responsive = false,
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  style,
  containerStyle,
  testID,
  animating = true,
  ...rest
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()

  const getIndicatorColor = () => {
    const variantColors: Record<ActivityIndicatorVariant, string> = {
      primary: useThemeColor({}, 'primary'),
      secondary: useThemeColor({}, 'secondary'),
      success: useThemeColor({}, 'success'),
      warning: useThemeColor({}, 'warning'),
      error: useThemeColor({}, 'error'),
      light: useThemeColor({}, 'textPrimary'),
      dark: useThemeColor({}, 'textSecondary'),
    }
    if (color) return color
    return variantColors[variant]
  }

  const responsiveSize = getResponsiveIndicatorSize(
    size,
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  const indicatorColor = getIndicatorColor()

  const containerStyles: ViewStyle = {
    ...styles.container,
    ...(containerStyle as ViewStyle),
  }

  const indicatorStyles: ViewStyle = {
    transform: [{ scale: responsiveSize / 24 }],
  }

  const finalStyles = { ...indicatorStyles, ...style }

  if (overlay) {
    return (
      <View
        style={Object.assign(
          {},
          styles.overlay,
          { backgroundColor: overlayColor },
          containerStyle,
        )}
        testID={testID ? `${testID}-overlay` : undefined}
      >
        <RNActivityIndicator
          animating={animating}
          color={indicatorColor}
          size="large"
          style={finalStyles}
          testID={testID}
          {...rest}
        />
      </View>
    )
  }

  return (
    <View
      style={containerStyles}
      testID={testID ? `${testID}-container` : undefined}
    >
      <RNActivityIndicator
        animating={animating}
        color={indicatorColor}
        size="large"
        style={finalStyles}
        testID={testID}
        accessible={true}
        accessibilityRole="progressbar"
        accessibilityLabel="Loading"
        accessibilityState={{
          busy: animating,
        }}
        {...rest}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
})
