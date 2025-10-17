import { cloneElement } from 'react'
import { PixelRatio, Text, TextStyle, View, ViewStyle } from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type { Icon } from '../AtomBaseProps'
import type { BadgeAtomProps, BadgeSize } from './BadgeProps'

const badgeSizes: Record<
  BadgeSize,
  {
    height: number
    paddingHorizontal: number
    fontSize: number
    minWidth: number
    iconSize: number
  }
> = {
  xs: {
    height: 16,
    paddingHorizontal: 4,
    fontSize: 10,
    minWidth: 16,
    iconSize: 10,
  },
  sm: {
    height: 18,
    paddingHorizontal: 6,
    fontSize: 11,
    minWidth: 18,
    iconSize: 12,
  },
  base: {
    height: 20,
    paddingHorizontal: 8,
    fontSize: 12,
    minWidth: 20,
    iconSize: 14,
  },
  lg: {
    height: 24,
    paddingHorizontal: 10,
    fontSize: 14,
    minWidth: 24,
    iconSize: 16,
  },
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.05,
}

const getResponsiveBadgeSize = (
  size: BadgeSize,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  const baseConfig = badgeSizes[size]

  if (!responsive) return baseConfig

  let multiplier = mobileAdjustments.regular

  if (isSmallPhone) {
    multiplier = mobileAdjustments.small
  } else if (isLargePhone) {
    multiplier = mobileAdjustments.large
  }

  return {
    height: PixelRatio.roundToNearestPixel(baseConfig.height * multiplier),
    paddingHorizontal: PixelRatio.roundToNearestPixel(
      baseConfig.paddingHorizontal * multiplier,
    ),
    fontSize: PixelRatio.roundToNearestPixel(baseConfig.fontSize * multiplier),
    minWidth: PixelRatio.roundToNearestPixel(baseConfig.minWidth * multiplier),
    iconSize: PixelRatio.roundToNearestPixel(baseConfig.iconSize * multiplier),
  }
}

const DotIndicator: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      marginRight: 4,
    }}
  />
)

export const Badge: React.FC<BadgeAtomProps> = ({
  size = 'base',
  variant = 'default',
  shape = 'rounded',
  badgeStyle = 'solid',
  responsive = false,
  style,
  textStyle,
  testID,
  children,
  label,
  count,
  maxCount = 99,
  leftIcon,
  rightIcon,
  icon,
  showDot = false,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()

  const responsiveSize = getResponsiveBadgeSize(
    size,
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  const getBadgeColors = () => {
    const colorConfig = {
      default: {
        solid: {
          background: useThemeColor({}, 'primary'),
          text: useThemeColor({}, 'textPrimary'),
          border: useThemeColor({}, 'secondary'),
        },
        outline: {
          background: 'transparent',
          text: useThemeColor({}, 'textPrimary'),
          border: useThemeColor({}, 'secondary'),
        },
        subtle: {
          background: useThemeColor({}, 'tint'),
          text: useThemeColor({}, 'textSecondary'),
          border: 'transparent',
        },
      },
      primary: {
        solid: {
          background: useThemeColor({}, 'primary'),
          text: useThemeColor({}, 'textPrimary'),
          border: useThemeColor({}, 'primary'),
        },
        outline: {
          background: 'transparent',
          text: useThemeColor({}, 'primary'),
          border: useThemeColor({}, 'primary'),
        },
        subtle: {
          background: useThemeColor({}, 'tint'),
          text: useThemeColor({}, 'primary'),
          border: 'transparent',
        },
      },
      secondary: {
        solid: {
          background: useThemeColor({}, 'secondary'),
          text: useThemeColor({}, 'textSecondary'),
          border: useThemeColor({}, 'secondary'),
        },
        outline: {
          background: 'transparent',
          text: useThemeColor({}, 'secondary'),
          border: useThemeColor({}, 'secondary'),
        },
        subtle: {
          background: useThemeColor({}, 'secondary'),
          text: useThemeColor({}, 'secondary'),
          border: 'transparent',
        },
      },
      success: {
        solid: {
          background: useThemeColor({}, 'success'),
          text: useThemeColor({}, 'white'),
          border: useThemeColor({}, 'success'),
        },
        outline: {
          background: 'transparent',
          text: useThemeColor({}, 'success'),
          border: useThemeColor({}, 'success'),
        },
        subtle: {
          background: useThemeColor({}, 'success'),
          text: useThemeColor({}, 'success'),
          border: 'transparent',
        },
      },
      warning: {
        solid: {
          background: useThemeColor({}, 'warning'),
          text: useThemeColor({}, 'white'),
          border: useThemeColor({}, 'warning'),
        },
        outline: {
          background: 'transparent',
          text: useThemeColor({}, 'warning'),
          border: useThemeColor({}, 'warning'),
        },
        subtle: {
          background: useThemeColor({}, 'warning'),
          text: useThemeColor({}, 'warning'),
          border: 'transparent',
        },
      },
      error: {
        solid: {
          background: useThemeColor({}, 'error'),
          text: useThemeColor({}, 'white'),
          border: useThemeColor({}, 'error'),
        },
        outline: {
          background: 'transparent',
          text: useThemeColor({}, 'error'),
          border: useThemeColor({}, 'error'),
        },
        subtle: {
          background: useThemeColor({}, 'error'),
          text: useThemeColor({}, 'error'),
          border: 'transparent',
        },
      },
      info: {
        solid: {
          background: useThemeColor({}, 'white'),
          text: useThemeColor({}, 'white'),
          border: useThemeColor({}, 'success'),
        },
        outline: {
          background: 'transparent',
          text: useThemeColor({}, 'textPrimary'),
          border: useThemeColor({}, 'success'),
        },
        subtle: {
          background: useThemeColor({}, 'success'),
          text: useThemeColor({}, 'textPrimary'),
          border: 'transparent',
        },
      },
    }

    return colorConfig[variant][badgeStyle]
  }

  const getBorderRadius = (): number => {
    switch (shape) {
      case 'pill':
        return responsiveSize.height / 2
      case 'rounded':
        return responsiveSize.height * 0.25
      case 'square':
        return 0
      default:
        return responsiveSize.height * 0.25
    }
  }

  const colors = getBadgeColors()

  const formatCount = (): string => {
    if (count === undefined) return ''
    if (typeof count === 'number' && count > maxCount) {
      return `${maxCount}+`
    }
    return count.toString()
  }

  const getDisplayContent = (): string => {
    if (count !== undefined) {
      return formatCount()
    }
    if (label) {
      return label
    }
    if (typeof children === 'string') {
      return children
    }
    return ''
  }

  const displayContent = getDisplayContent()
  const hasText = !!displayContent
  const hasLeftIcon = !!leftIcon
  const hasRightIcon = !!rightIcon
  const hasIcon = !!icon
  const hasDot = showDot

  const containerStyle: ViewStyle = {
    height: responsiveSize.height,
    minWidth: hasText ? responsiveSize.minWidth : responsiveSize.height,
    paddingHorizontal: hasText ? responsiveSize.paddingHorizontal : 0,
    backgroundColor: colors.background,
    borderRadius: getBorderRadius(),
    borderWidth: badgeStyle === 'outline' ? 1 : 0,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const textStyles: TextStyle = {
    fontSize: responsiveSize.fontSize,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: responsiveSize.fontSize * 1.2,
  }

  const renderIcon = (
    iconComponent: React.ReactNode,
    position: 'left' | 'right' | 'center' = 'center',
  ) => {
    if (!iconComponent) return null

    const marginStyle = hasText
      ? position === 'left'
        ? { marginRight: 4 }
        : position === 'right'
          ? { marginLeft: 4 }
          : {}
      : {}

    return (
      <View style={marginStyle}>
        {cloneElement(iconComponent as React.ReactElement<Icon>, {
          size: responsiveSize.iconSize,
          color: colors.text,
        })}
      </View>
    )
  }

  const renderContent = () => {
    if (hasIcon && !hasText) {
      return renderIcon(icon, 'center')
    }

    return (
      <>
        {hasDot && (
          <DotIndicator
            size={responsiveSize.fontSize * 0.6}
            color={colors.text}
          />
        )}
        {hasLeftIcon && renderIcon(leftIcon, 'left')}
        {hasText && (
          <Text style={Object.assign({}, textStyle, textStyles)}>
            {displayContent}
          </Text>
        )}
        {typeof children !== 'string' && children}
        {hasRightIcon && renderIcon(rightIcon, 'right')}
      </>
    )
  }

  const getAccessibilityLabel = (): string => {
    if (accessibilityLabel) return accessibilityLabel
    if (count !== undefined) return `${formatCount()} notifications`
    if (label) return label
    if (typeof children === 'string') return children
    return 'Badge'
  }

  const finalContainerStyles = { ...containerStyle, ...style }

  return (
    <View
      style={finalContainerStyles}
      testID={testID}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={accessibilityHint}
      {...rest}
    >
      {renderContent()}
    </View>
  )
}
