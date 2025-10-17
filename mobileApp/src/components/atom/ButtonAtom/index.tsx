import { cloneElement } from 'react'
import {
  ActivityIndicator,
  PixelRatio,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type { Icon } from '../AtomBaseProps'
import type { ButtonAtomProps, ButtonSize, ButtonVariant } from './ButtonProps'

const buttonSizes: Record<
  ButtonSize,
  {
    height: number
    paddingHorizontal: number
    paddingVertical: number
    fontSize: number
    iconSize: number
    borderRadius: number
    size?: number
  }
> = {
  xs: {
    height: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    iconSize: 14,
    borderRadius: 4,
  },
  sm: {
    height: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    iconSize: 16,
    borderRadius: 6,
  },
  base: {
    height: 40,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    iconSize: 18,
    borderRadius: 8,
  },
  lg: {
    height: 48,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 18,
    iconSize: 20,
    borderRadius: 10,
  },
  xl: {
    height: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
    fontSize: 20,
    iconSize: 24,
    borderRadius: 12,
  },
}

const fabSizes: Record<
  ButtonSize,
  {
    size: number
    iconSize: number
    height?: number
    paddingHorizontal?: number
    paddingVertical?: number
    fontSize?: number
    borderRadius?: number
  }
> = {
  xs: { size: 32, iconSize: 16 },
  sm: { size: 40, iconSize: 18 },
  base: { size: 48, iconSize: 20 },
  lg: { size: 56, iconSize: 24 },
  xl: { size: 64, iconSize: 28 },
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.05,
}

const getResponsiveButtonSize = (
  size: ButtonSize,
  variant: ButtonVariant,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  const baseConfig = variant === 'fab' ? fabSizes[size] : buttonSizes[size]

  if (!responsive) return baseConfig

  let multiplier = mobileAdjustments.regular

  if (isSmallPhone) {
    multiplier = mobileAdjustments.small
  } else if (isLargePhone) {
    multiplier = mobileAdjustments.large
  }

  if (variant === 'fab') {
    return {
      size: PixelRatio.roundToNearestPixel(baseConfig.size! * multiplier),
      iconSize: PixelRatio.roundToNearestPixel(
        baseConfig.iconSize * multiplier,
      ),
    }
  }

  return {
    height: PixelRatio.roundToNearestPixel(baseConfig.height! * multiplier),
    paddingHorizontal: PixelRatio.roundToNearestPixel(
      baseConfig.paddingHorizontal! * multiplier,
    ),
    paddingVertical: PixelRatio.roundToNearestPixel(
      baseConfig.paddingVertical! * multiplier,
    ),
    fontSize: PixelRatio.roundToNearestPixel(baseConfig.fontSize! * multiplier),
    iconSize: PixelRatio.roundToNearestPixel(baseConfig.iconSize * multiplier),
    borderRadius: PixelRatio.roundToNearestPixel(
      baseConfig.borderRadius! * multiplier,
    ),
  }
}

export const Button: React.FC<ButtonAtomProps> = ({
  size = 'base',
  variant = 'primary',
  state = 'default',
  shape = 'rounded',
  responsive = false,
  style,
  textStyle,
  testID,
  title,
  children,
  leftIcon,
  rightIcon,
  icon,
  loading = false,
  loadingText,
  loadingIcon,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  onPress,
  onLongPress,
  hapticFeedback = false,
  ...rest
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()

  const currentState = disabled ? 'disabled' : loading ? 'loading' : state
  const isInteractive =
    currentState !== 'disabled' && currentState !== 'loading'

  const responsiveSize = getResponsiveButtonSize(
    size,
    variant,
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  const getButtonColors = (pressed = false) => {
    const colorVariants = {
      primary: {
        background: useThemeColor({}, 'primary'),
        text: useThemeColor({}, 'textPrimary'),
        border: useThemeColor({}, 'primary'),
      },
      secondary: {
        background: useThemeColor({}, 'secondary'),
        text: useThemeColor({}, 'textSecondary'),
        border: useThemeColor({}, 'secondary'),
      },
      outline: {
        background: 'transparent',
        text: useThemeColor({}, 'primary'),
        border: useThemeColor({}, 'primary'),
      },
      ghost: {
        background: 'transparent',
        text: useThemeColor({}, 'textPrimary'),
        border: 'transparent',
      },
      link: {
        background: 'transparent',
        text: useThemeColor({}, 'primary'),
        border: 'transparent',
      },
      success: {
        background: useThemeColor({}, 'success'),
        text: useThemeColor({}, 'white'),
        border: useThemeColor({}, 'success'),
      },
      warning: {
        background: useThemeColor({}, 'warning'),
        text: useThemeColor({}, 'white'),
        border: useThemeColor({}, 'warning'),
      },
      error: {
        background: useThemeColor({}, 'error'),
        text: useThemeColor({}, 'white'),
        border: useThemeColor({}, 'error'),
      },
      fab: {
        background: useThemeColor({}, 'primary'),
        text: useThemeColor({}, 'textPrimary'),
        border: useThemeColor({}, 'primary'),
      },
      icon: {
        background: 'transparent',
        text: useThemeColor({}, 'textPrimary'),
        border: 'transparent',
      },
    }
    const pressOpacity =
      variant === 'link' || variant === 'ghost' || variant === 'icon'
        ? 0.5
        : 0.8
    const colors = colorVariants[variant]
    const disabledColors = {
      background: useThemeColor({}, 'disabled'),
      text: useThemeColor({}, 'white'),
      border: useThemeColor({}, 'disabled'),
    }
    const pressedColors = {
      background:
        colors.background === 'transparent'
          ? colors.background
          : `${colors.background}${Math.round(255 * pressOpacity)
              .toString(16)
              .padStart(2, '0')}`,
      text: colors.text,
      border:
        colors.border === 'transparent'
          ? colors.border
          : `${colors.border}${Math.round(255 * pressOpacity)
              .toString(16)
              .padStart(2, '0')}`,
    }

    if (currentState === 'disabled') {
      return disabledColors
    }

    if (pressed) {
      return pressedColors
    }

    return colors
  }

  const getContainerStyle = (pressed: boolean): ViewStyle => {
    const colors = getButtonColors(pressed)

    let baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: colors.background,
      opacity: currentState === 'disabled' ? 0.6 : 1,
    }

    if (variant === 'fab') {
      const fabSize = responsiveSize as { size: number; iconSize: number }
      baseStyle = {
        ...baseStyle,
        width: fabSize.size,
        height: fabSize.size,
        borderRadius: fabSize.size / 2,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      }
    } else if (variant === 'icon') {
      const buttonSize = responsiveSize as (typeof buttonSizes)['base']
      const iconButtonSize = Math.max(44, buttonSize.height)
      baseStyle = {
        ...baseStyle,
        width: shape === 'circle' ? iconButtonSize : buttonSize.height,
        height: iconButtonSize,
        borderRadius:
          shape === 'circle' ? iconButtonSize / 2 : buttonSize.borderRadius,
        paddingHorizontal: 0,
        paddingVertical: 0,
      }
    } else if (variant === 'link') {
      baseStyle = {
        ...baseStyle,
        paddingHorizontal: 4,
        paddingVertical: 2,
        minHeight: 0,
      }
    } else {
      const buttonSize = responsiveSize as (typeof buttonSizes)['base']
      baseStyle = {
        ...baseStyle,
        height: buttonSize.height,
        paddingHorizontal: buttonSize.paddingHorizontal,
        paddingVertical: buttonSize.paddingVertical,
        borderRadius: shape === 'square' ? 0 : buttonSize.borderRadius,
      }

      if (variant === 'outline') {
        baseStyle.borderWidth = 1
        baseStyle.borderColor = colors.border
      }
    }

    return baseStyle
  }

  const getTextStyle = (pressed: boolean): TextStyle => {
    const colors = getButtonColors(pressed)

    if (variant === 'fab' || variant === 'icon') {
      return { color: colors.text }
    }

    const buttonSize = responsiveSize as (typeof buttonSizes)['base']

    let textStyles: TextStyle = {
      fontSize: buttonSize.fontSize,
      fontWeight: variant === 'link' ? '400' : '600',
      color: colors.text,
      textAlign: 'center',
    }

    if (variant === 'link') {
      textStyles = {
        ...textStyles,
        textDecorationLine: 'underline',
      }
    }

    return textStyles
  }

  const handlePress = () => {
    if (isInteractive && onPress) {
      if (hapticFeedback) {
      }
      onPress()
    }
  }

  const renderContent = (pressed: boolean) => {
    const colors = getButtonColors(pressed)
    const buttonSize = responsiveSize as (typeof buttonSizes)['base']
    const iconSize =
      variant === 'fab'
        ? (responsiveSize as { size: number; iconSize: number }).iconSize
        : buttonSize.iconSize

    if (currentState === 'loading') {
      const loadingSpinner = loadingIcon ?? (
        <ActivityIndicator size={iconSize} color={colors.text} />
      )
      const displayText = loadingText ?? title

      if (variant === 'fab' || variant === 'icon') {
        return loadingSpinner
      }

      return (
        <>
          {loadingSpinner}
          {displayText && (
            <Text
              style={Object.assign(
                {},
                getTextStyle(pressed),
                { marginLeft: 8 },
                textStyle,
              )}
            >
              {displayText}
            </Text>
          )}
        </>
      )
    }

    if (variant === 'fab') {
      if (icon) {
        return cloneElement(icon as React.ReactElement<Icon>, {
          size: iconSize,
          color: colors.text,
        })
      }
      return null
    }

    if (variant === 'icon') {
      if (icon) {
        return cloneElement(icon as React.ReactElement<Icon>, {
          size: iconSize,
          color: colors.text,
        })
      }
      return null
    }

    const displayText = title ?? (typeof children === 'string' ? children : '')
    const hasText = !!displayText
    const hasLeftIcon = !!leftIcon
    const hasRightIcon = !!rightIcon

    return (
      <>
        {hasLeftIcon && (
          <View style={{ marginRight: hasText ? 8 : 0 }}>
            {cloneElement(leftIcon as React.ReactElement<Icon>, {
              size: iconSize,
              color: colors.text,
            })}
          </View>
        )}

        {hasText && (
          <Text style={Object.assign({}, getTextStyle(pressed), textStyle)}>
            {displayText}
          </Text>
        )}

        {typeof children !== 'string' && children}

        {hasRightIcon && (
          <View style={{ marginLeft: hasText ? 8 : 0 }}>
            {cloneElement(rightIcon as React.ReactElement<Icon>, {
              size: iconSize,
              color: colors.text,
            })}
          </View>
        )}
      </>
    )
  }

  const finalContainerStyles = style

  return (
    <Pressable
      style={({ pressed }) =>
        Object.assign({}, getContainerStyle(pressed), finalContainerStyles)
      }
      onPress={handlePress}
      onLongPress={onLongPress}
      disabled={!isInteractive}
      testID={testID}
      accessible={true}
      accessibilityRole={variant === 'link' ? 'link' : 'button'}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: !isInteractive,
        busy: currentState === 'loading',
      }}
      {...rest}
    >
      {({ pressed }) => renderContent(pressed)}
    </Pressable>
  )
}

export const IconButton: React.FC<Omit<ButtonAtomProps, 'variant'>> = (
  props,
) => <Button {...props} variant="icon" />

export const FAB: React.FC<Omit<ButtonAtomProps, 'variant'>> = (props) => (
  <Button {...props} variant="fab" />
)

export const LinkButton: React.FC<Omit<ButtonAtomProps, 'variant'>> = (
  props,
) => <Button {...props} variant="link" />
