import { PixelRatio, View as RNView, ViewStyle } from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type {
  ViewAtomProps,
  ViewMargin,
  ViewPadding,
  ViewRadius,
  ViewShadow,
} from './ViewProps'

const spacingValues: Record<ViewPadding, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
}

const radiusValues: Record<ViewRadius, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  base: 12,
  lg: 16,
  xl: 24,
  full: 9999,
}

const shadowValues: Record<
  ViewShadow,
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

const getResponsiveSpacing = (
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

export const View: React.FC<ViewAtomProps> = ({
  variant = 'default',
  padding,
  paddingVertical,
  paddingHorizontal,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  margin,
  marginVertical,
  marginHorizontal,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  radius = 'none',
  shadow = 'none',
  shadowColor,
  backgroundColor,
  borderColor,
  borderWidth,
  responsive = false,
  flex,
  flexDirection,
  justifyContent,
  alignItems,
  alignSelf,
  width,
  height,
  style,
  testID,
  children,
  ...rest
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()

  const cardBackground = useThemeColor({}, 'tint')
  const elevatedBackground = useThemeColor({}, 'primary')
  const outlinedBackground = useThemeColor({}, 'background')
  const outlinedBorder = useThemeColor({}, 'secondary')
  const defaultShadowColor = useThemeColor({}, 'textPrimary')

  const getResponsivePadding = (key: ViewPadding | undefined) => {
    if (!key) return undefined
    return getResponsiveSpacing(
      spacingValues[key],
      isSmallPhone,
      isLargePhone,
      responsive,
    )
  }

  const getResponsiveMargin = (key: ViewMargin | undefined) => {
    if (!key) return undefined
    return getResponsiveSpacing(
      spacingValues[key],
      isSmallPhone,
      isLargePhone,
      responsive,
    )
  }

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'card':
        return {
          backgroundColor: backgroundColor ?? cardBackground,
          borderRadius: radiusValues[radius],
          ...shadowValues.base,
          shadowColor: shadowColor ?? defaultShadowColor,
        }
      case 'elevated':
        return {
          backgroundColor: backgroundColor ?? elevatedBackground,
          borderRadius: radiusValues[radius],
          ...shadowValues.lg,
          shadowColor: shadowColor ?? defaultShadowColor,
        }
      case 'outlined':
        return {
          backgroundColor: backgroundColor ?? outlinedBackground,
          borderRadius: radiusValues[radius],
          borderWidth: borderWidth ?? 1,
          borderColor: borderColor ?? outlinedBorder,
        }
      case 'transparent':
        return {
          backgroundColor: 'transparent',
        }
      default:
        return {
          backgroundColor: backgroundColor,
        }
    }
  }

  const getShadowStyles = (): ViewStyle => {
    if (shadow === 'none' || variant === 'card' || variant === 'elevated') {
      return {}
    }

    return {
      ...shadowValues[shadow],
      shadowColor: shadowColor ?? defaultShadowColor,
    }
  }

  const viewStyles: ViewStyle = {
    ...getVariantStyles(),
    ...getShadowStyles(),

    ...(padding && { padding: getResponsivePadding(padding) }),
    ...(paddingVertical && {
      paddingVertical: getResponsivePadding(paddingVertical),
    }),
    ...(paddingHorizontal && {
      paddingHorizontal: getResponsivePadding(paddingHorizontal),
    }),
    ...(paddingTop && { paddingTop: getResponsivePadding(paddingTop) }),
    ...(paddingBottom && {
      paddingBottom: getResponsivePadding(paddingBottom),
    }),
    ...(paddingLeft && { paddingLeft: getResponsivePadding(paddingLeft) }),
    ...(paddingRight && { paddingRight: getResponsivePadding(paddingRight) }),

    ...(margin && { margin: getResponsiveMargin(margin) }),
    ...(marginVertical && {
      marginVertical: getResponsiveMargin(marginVertical),
    }),
    ...(marginHorizontal && {
      marginHorizontal: getResponsiveMargin(marginHorizontal),
    }),
    ...(marginTop && { marginTop: getResponsiveMargin(marginTop) }),
    ...(marginBottom && { marginBottom: getResponsiveMargin(marginBottom) }),
    ...(marginLeft && { marginLeft: getResponsiveMargin(marginLeft) }),
    ...(marginRight && { marginRight: getResponsiveMargin(marginRight) }),

    ...(variant !== 'card' &&
      variant !== 'elevated' &&
      variant !== 'outlined' && {
        borderRadius: radiusValues[radius],
      }),

    ...(borderWidth && variant !== 'outlined' && { borderWidth }),
    ...(borderColor && variant !== 'outlined' && { borderColor }),

    ...(flex !== undefined && { flex }),
    ...(flexDirection && { flexDirection }),
    ...(justifyContent && { justifyContent }),
    ...(alignItems && { alignItems }),
    ...(alignSelf && { alignSelf }),

    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
  }

  return (
    <RNView
      style={Object.assign({}, style, viewStyles)}
      testID={testID}
      {...rest}
    >
      {children}
    </RNView>
  )
}
