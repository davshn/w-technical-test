import { useEffect, useRef } from 'react'
import {
  Animated,
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
import type { ToastBaseProps, ToastSize, ToastVariant } from './ToastProps'

const toastSizes: Record<
  ToastSize,
  {
    paddingVertical: number
    paddingHorizontal: number
    fontSize: number
    iconSize: number
    minHeight: number
  }
> = {
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 12,
    iconSize: 16,
    minHeight: 40,
  },
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    iconSize: 20,
    minHeight: 48,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    iconSize: 24,
    minHeight: 56,
  },
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.05,
}

const getResponsiveToastSize = (
  size: ToastSize,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  const baseConfig = toastSizes[size]

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
    minHeight: PixelRatio.roundToNearestPixel(
      baseConfig.minHeight * multiplier,
    ),
  }
}

export const ToastBase: React.FC<ToastBaseProps> = ({
  message,
  variant = 'default',
  position = 'bottom',
  size = 'base',
  duration = 3000,
  visible = false,
  onHide,
  onPress,
  icon,
  closeIcon,
  showCloseButton = false,
  responsive = false,
  style,
  testID,
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateY = useRef(
    new Animated.Value(position === 'top' ? -100 : 100),
  ).current
  const timeoutRef = useRef<any | number>(0)

  const getVariantColors = () => {
    const success = useThemeColor({}, 'success')
    const error = useThemeColor({}, 'error')
    const warning = useThemeColor({}, 'warning')
    const info = useThemeColor({}, 'primary')
    const toastBackground = useThemeColor({}, 'background')
    const toastText = useThemeColor({}, 'textSecondary')

    const variants: Record<ToastVariant, { background: string; text: string }> =
      {
        default: {
          background: toastBackground,
          text: toastText,
        },
        success: {
          background: success,
          text: useThemeColor({}, 'white'),
        },
        error: {
          background: error,
          text: useThemeColor({}, 'white'),
        },
        warning: {
          background: warning,
          text: useThemeColor({}, 'white'),
        },
        info: {
          background: info,
          text: useThemeColor({}, 'white'),
        },
      }

    return variants[variant]
  }

  const colors = getVariantColors()
  const responsiveSize = getResponsiveToastSize(
    size,
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  useEffect(() => {
    if (visible) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start()

      if (duration > 0) {
        timeoutRef.current = setTimeout(() => {
          handleHide()
        }, duration)
      }
    } else {
      handleHide()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [visible])

  const handleHide = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) {
        onHide()
      }
    })
  }

  const handlePress = () => {
    if (onPress) {
      onPress()
    }
  }

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    handleHide()
  }

  const toastStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveSize.paddingVertical,
    paddingHorizontal: responsiveSize.paddingHorizontal,
    minHeight: responsiveSize.minHeight,
    backgroundColor: colors.background,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: '90%',
  }

  const textStyles: TextStyle = {
    fontSize: responsiveSize.fontSize,
    color: colors.text,
    flex: 1,
    fontWeight: '500',
  }

  const getContainerStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 9999,
    }

    switch (position) {
      case 'top':
        return {
          ...baseStyles,
          top: 50,
        }
      case 'center':
        return {
          ...baseStyles,
          top: '50%',
          transform: [{ translateY: -responsiveSize.minHeight / 2 }],
        }
      case 'bottom':
      default:
        return {
          ...baseStyles,
          bottom: 50,
        }
    }
  }

  const containerStyles = getContainerStyles()

  if (!visible) {
    return null
  }

  const Content = (
    <Animated.View
      style={[
        containerStyles,
        {
          opacity: fadeAnim,
          transform:
            position === 'center'
              ? containerStyles.transform
              : [{ translateY }],
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={Object.assign({}, toastStyles, style)} testID={testID}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <Text style={textStyles} numberOfLines={3}>
          {message}
        </Text>

        {showCloseButton && (
          <Pressable
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={8}
            testID={testID ? `${testID}-close` : undefined}
          >
            {closeIcon ?? (
              <Text
                style={Object.assign(
                  {},
                  { fontSize: responsiveSize.iconSize },
                  textStyles,
                )}
              >
                ×
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </Animated.View>
  )

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
        pointerEvents="box-none"
      >
        {Content}
      </Pressable>
    )
  }

  return Content
}

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 12,
  },
  closeButton: {
    marginLeft: 12,
    opacity: 0.8,
  },
})
