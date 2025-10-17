import {
  PixelRatio,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type {
  TagAtomProps,
  TagShape,
  TagSize,
  TagVariant,
} from './TagProps'

const tagSizes: Record<
  TagSize,
  {
    paddingVertical: number
    paddingHorizontal: number
    fontSize: number
    iconSize: number
    closeSize: number
  }
> = {
  xs: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    fontSize: 10,
    iconSize: 12,
    closeSize: 10,
  },
  sm: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 12,
    iconSize: 14,
    closeSize: 12,
  },
  base: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    iconSize: 16,
    closeSize: 14,
  },
  lg: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    iconSize: 18,
    closeSize: 16,
  },
}

const tagShapes: Record<TagShape, number | string> = {
  rounded: 6,
  pill: 9999,
  square: 0,
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.05,
}

const getResponsiveTagSize = (
  size: TagSize,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  const baseConfig = tagSizes[size]

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
    paddingVertical: PixelRatio.roundToNearestPixel(
      baseConfig.paddingVertical * multiplier,
    ),
    paddingHorizontal: PixelRatio.roundToNearestPixel(
      baseConfig.paddingHorizontal * multiplier,
    ),
    fontSize: PixelRatio.roundToNearestPixel(baseConfig.fontSize * multiplier),
    iconSize: PixelRatio.roundToNearestPixel(baseConfig.iconSize * multiplier),
    closeSize: PixelRatio.roundToNearestPixel(
      baseConfig.closeSize * multiplier,
    ),
  }
}

export const Tag: React.FC<TagAtomProps> = ({
  label,
  size = 'base',
  variant = 'default',
  shape = 'rounded',
  responsive = false,
  pressable = false,
  onPress,
  onClose,
  disabled = false,
  icon,
  closeIcon,
  style,
  textStyle,
  testID,
  ...rest
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()

  const getVariantColors = () => {
    const primary = useThemeColor({}, 'primary')
    const secondary = useThemeColor({}, 'secondary')
    const success = useThemeColor({}, 'success')
    const warning = useThemeColor({}, 'warning')
    const error = useThemeColor({}, 'error')
    const info = useThemeColor({}, 'tint')
    const tagBackground = useThemeColor({}, 'background')
    const tagText = useThemeColor({}, 'textSecondary')
    const border = useThemeColor({}, 'primary')
    const textPrimary = useThemeColor({}, 'textPrimary')

    const variants: Record<
      TagVariant,
      { background: string; text: string; border?: string }
    > = {
      default: {
        background: tagBackground,
        text: tagText,
      },
      primary: {
        background: primary,
        text: useThemeColor({}, 'white'),
      },
      secondary: {
        background: secondary,
        text: useThemeColor({}, 'white'),
      },
      success: {
        background: success,
        text: useThemeColor({}, 'white'),
      },
      warning: {
        background: warning,
        text: useThemeColor({}, 'white'),
      },
      error: {
        background: error,
        text: useThemeColor({}, 'white'),
      },
      info: {
        background: info,
        text: useThemeColor({}, 'white'),
      },
      outline: {
        background: 'transparent',
        text: textPrimary,
        border: border,
      },
    }

    return variants[variant]
  }

  const colors = getVariantColors()

  const isInteractive = pressable || !!onPress

  const responsiveSize = getResponsiveTagSize(
    size,
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  const containerStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveSize.paddingVertical,
    paddingHorizontal: responsiveSize.paddingHorizontal,
    backgroundColor: colors.background,
    borderRadius:
      typeof tagShapes[shape] === 'number'
        ? (tagShapes[shape] as number)
        : 9999,
    ...(variant === 'outline' && {
      borderWidth: 1,
      borderColor: colors.border,
    }),
  }

  const labelStyles: TextStyle = {
    fontSize: responsiveSize.fontSize,
    color: colors.text,
    fontWeight: '500',
  }

  const closeButtonStyles: ViewStyle = {
    marginLeft: responsiveSize.paddingHorizontal / 2,
    opacity: 0.7,
  }

  const finalContainerStyles = { ...containerStyles, ...style }
  const finalTextStyles = { ...labelStyles, ...textStyle }
  const renderContent = () => (
    <>
      {icon && (
        <View style={{ marginRight: responsiveSize.paddingHorizontal / 2 }}>
          {icon}
        </View>
      )}
      <Text style={finalTextStyles} numberOfLines={1}>
        {label}
      </Text>
      {onClose && (
        <Pressable
          onPress={disabled ? undefined : onClose}
          disabled={disabled}
          style={closeButtonStyles}
          hitSlop={8}
          testID={testID ? `${testID}-close` : undefined}
        >
          {closeIcon ?? (
            <Text
              style={Object.assign({}, labelStyles, {
                fontSize: responsiveSize.closeSize,
              })}
            >
              ×
            </Text>
          )}
        </Pressable>
      )}
    </>
  )

  if (isInteractive) {
    return (
      <Pressable
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        style={({ pressed }) =>
          Object.assign(
            {},
            pressed && !disabled && styles.pressed,
            disabled && styles.disabled,
            finalContainerStyles,
          )
        }
        testID={testID}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        {...rest}
      >
        {renderContent()}
      </Pressable>
    )
  }

  return (
    <View
      style={Object.assign(
        {},
        finalContainerStyles,
        disabled && styles.disabled,
      )}
      testID={testID}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={label}
      {...rest}
    >
      {renderContent()}
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
