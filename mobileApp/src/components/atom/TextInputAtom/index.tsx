import { cloneElement, forwardRef, useState } from 'react'
import {
  PixelRatio,
  Pressable,
  TextInput as RNTextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type { Icon } from '../AtomBaseProps'
import type { TextInputAtomProps, TextInputSize } from './TextInputProps'

const inputSizes: Record<
  TextInputSize,
  {
    fontSize: number
    height: number
    paddingHorizontal: number
    paddingVertical: number
    iconSize: number
  }
> = {
  sm: {
    fontSize: 14,
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    iconSize: 18,
  },
  base: {
    fontSize: 16,
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    iconSize: 20,
  },
  lg: {
    fontSize: 18,
    height: 56,
    paddingHorizontal: 20,
    paddingVertical: 16,
    iconSize: 24,
  },
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.05,
}

const getResponsiveInputSize = (
  size: TextInputSize,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  const baseConfig = inputSizes[size]

  if (!responsive) return baseConfig

  let multiplier = mobileAdjustments.regular

  if (isSmallPhone) {
    multiplier = mobileAdjustments.small
  } else if (isLargePhone) {
    multiplier = mobileAdjustments.large
  }

  return {
    fontSize: PixelRatio.roundToNearestPixel(baseConfig.fontSize * multiplier),
    height: PixelRatio.roundToNearestPixel(baseConfig.height * multiplier),
    paddingHorizontal: PixelRatio.roundToNearestPixel(
      baseConfig.paddingHorizontal * multiplier,
    ),
    paddingVertical: PixelRatio.roundToNearestPixel(
      baseConfig.paddingVertical * multiplier,
    ),
    iconSize: PixelRatio.roundToNearestPixel(baseConfig.iconSize * multiplier),
  }
}

export const TextInput = forwardRef<RNTextInput, TextInputAtomProps>(
  (
    {
      size = 'base',
      variant = 'outlined',
      state = 'default',
      responsive = false,
      containerStyle,
      inputStyle,
      testID,
      leftIcon,
      rightIcon,
      onRightIconPress,
      onLeftIconPress,
      editable = true,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const { isSmallPhone, isLargePhone } = useResponsive()

    const currentState = !editable ? 'disabled' : isFocused ? 'focused' : state

    const responsiveSize = getResponsiveInputSize(
      size,
      isSmallPhone,
      isLargePhone,
      responsive,
    )

    const colors = {
      background: {
        default: useThemeColor({}, 'background'),
        filled: useThemeColor({}, 'tint'),
        disabled: useThemeColor({}, 'disabled'),
      },
      border: {
        default: useThemeColor({}, 'secondary'),
        focused: useThemeColor({}, 'primary'),
        error: useThemeColor({}, 'error'),
        disabled: useThemeColor({}, 'disabled'),
      },
      text: {
        default: useThemeColor({}, 'textPrimary'),
        placeholder: useThemeColor({}, 'textSecondary'),
        disabled: useThemeColor({}, 'disabled'),
      },
      icon: {
        default: useThemeColor({}, 'textSecondary'),
        focused: useThemeColor({}, 'primary'),
        error: useThemeColor({}, 'error'),
        disabled: useThemeColor({}, 'disabled'),
      },
    }

    const handleFocus = (e: any) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: any) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const getBorderColor = (): string => {
      switch (currentState) {
        case 'focused':
          return colors.border.focused
        case 'error':
          return colors.border.error
        case 'disabled':
          return colors.border.disabled
        default:
          return colors.border.default
      }
    }

    const getIconColor = (): string => {
      switch (currentState) {
        case 'focused':
          return colors.icon.focused
        case 'error':
          return colors.icon.error
        case 'disabled':
          return colors.icon.disabled
        default:
          return colors.icon.default
      }
    }

    const getContainerStyle = (): ViewStyle => {
      const baseStyle: ViewStyle = {
        height: responsiveSize.height,
        flexDirection: 'row',
        alignItems: 'center',
      }

      switch (variant) {
        case 'outlined':
          return {
            ...baseStyle,
            backgroundColor:
              currentState === 'disabled'
                ? colors.background.disabled
                : colors.background.default,
            borderWidth: currentState === 'focused' ? 2 : 1,
            borderColor: getBorderColor(),
            borderRadius: 8,
            paddingHorizontal: responsiveSize.paddingHorizontal,
          }

        case 'filled':
          return {
            ...baseStyle,
            backgroundColor:
              currentState === 'disabled'
                ? colors.background.disabled
                : colors.background.filled,
            borderRadius: 8,
            borderBottomWidth: currentState === 'focused' ? 3 : 2,
            borderBottomColor: getBorderColor(),
            paddingHorizontal: responsiveSize.paddingHorizontal,
          }

        case 'underlined':
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            borderBottomWidth: currentState === 'focused' ? 2 : 1,
            borderBottomColor: getBorderColor(),
            paddingHorizontal: 4,
          }

        case 'borderless':
          return {
            ...baseStyle,
            backgroundColor: 'transparent',
            paddingHorizontal: 4,
          }

        default:
          return baseStyle
      }
    }

    const getInputStyle = (): TextStyle => {
      return {
        flex: 1,
        fontSize: responsiveSize.fontSize,
        lineHeight: PixelRatio.roundToNearestPixel(
          responsiveSize.fontSize * 1.4,
        ),
        color:
          currentState === 'disabled'
            ? colors.text.disabled
            : colors.text.default,
        paddingVertical: 0,
        paddingHorizontal: 0,
        textAlignVertical: 'center',
      }
    }

    const renderIcon = (
      icon: React.ReactNode,
      onPress?: () => void,
      position: 'left' | 'right' = 'left',
    ) => {
      if (!icon) return null

      const iconWrapper = (
        <View
          style={{
            marginLeft: position === 'right' ? 8 : 0,
            marginRight: position === 'left' ? 8 : 0,
            opacity: currentState === 'disabled' ? 0.5 : 1,
          }}
        >
          {cloneElement(icon as React.ReactElement<Icon>, {
            size: responsiveSize.iconSize,
            color: getIconColor(),
          })}
        </View>
      )

      if (onPress && currentState !== 'disabled') {
        return (
          <Pressable
            onPress={onPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            testID={`${testID}-${position}-icon-button`}
          >
            {iconWrapper}
          </Pressable>
        )
      }

      return iconWrapper
    }
    const finalContainerStyles = { ...getContainerStyle(), ...containerStyle }
    const finalInputStyles = { ...getInputStyle(), ...inputStyle }

    return (
      <View
        style={finalContainerStyles}
        testID={testID ? `${testID}-container` : undefined}
      >
        {renderIcon(leftIcon, onLeftIconPress, 'left')}

        <RNTextInput
          ref={ref}
          style={finalInputStyles}
          placeholderTextColor={colors.text.placeholder}
          selectionColor={colors.border.focused}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          testID={testID}
          accessible={true}
          accessibilityRole="text"
          accessibilityState={{
            disabled: !editable,
          }}
          allowFontScaling={true}
          maxFontSizeMultiplier={1.5}
          textContentType="none"
          autoComplete="off"
          autoCorrect={false}
          spellCheck={false}
          {...rest}
        />

        {renderIcon(rightIcon, onRightIconPress, 'right')}
      </View>
    )
  },
)
