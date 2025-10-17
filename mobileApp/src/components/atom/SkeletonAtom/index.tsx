import { useEffect, useRef } from 'react'
import {
  Animated,
  DimensionValue,
  PixelRatio,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type { SkeletonProps, SkeletonSize } from './SkeletonProps'

const textSizes: Record<
  SkeletonSize,
  {
    height: number
    fontSize: number
  }
> = {
  sm: {
    height: 12,
    fontSize: 12,
  },
  base: {
    height: 16,
    fontSize: 16,
  },
  lg: {
    height: 20,
    fontSize: 20,
  },
  xl: {
    height: 24,
    fontSize: 24,
  },
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.05,
}

const getResponsiveSize = (
  value: DimensionValue,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
): DimensionValue => {
  if (value === undefined || typeof value === 'string' || value === null) {
    return value
  }

  if (!responsive) {
    return value
  }

  let multiplier = mobileAdjustments.regular

  if (isSmallPhone) {
    multiplier = mobileAdjustments.small
  } else if (isLargePhone) {
    multiplier = mobileAdjustments.large
  }

  return PixelRatio.roundToNearestPixel((value as number) * multiplier)
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rect',
  size = 'base',
  width,
  height,
  borderRadius,
  lines = 1,
  lineSpacing = 8,
  lastLineWidth = '60%',
  animated = true,
  backgroundColor,
  highlightColor,
  animationDuration = 1500,
  responsive = false,
  style,
  testID,
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()
  const shimmerAnimation = useRef(new Animated.Value(0)).current

  const skeletonBackground = useThemeColor({}, 'primary')
  const skeletonHighlight = useThemeColor({}, 'secondary')

  const finalBackgroundColor = backgroundColor ?? skeletonBackground
  const finalHighlightColor = highlightColor ?? skeletonHighlight

  useEffect(() => {
    if (animated) {
      const shimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      )

      shimmer.start()

      return () => shimmer.stop()
    }
  }, [animated, animationDuration])

  const translateX = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  })

  const opacity = shimmerAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  })

  const getDimensions = (): {
    width: DimensionValue
    height: DimensionValue
  } => {
    const textSize = textSizes[size]

    const responsiveWidth = getResponsiveSize(
      width as DimensionValue,
      isSmallPhone,
      isLargePhone,
      responsive,
    )
    const responsiveHeight = getResponsiveSize(
      height as DimensionValue,
      isSmallPhone,
      isLargePhone,
      responsive,
    )
    const responsiveTextHeight = getResponsiveSize(
      textSize.height,
      isSmallPhone,
      isLargePhone,
      responsive,
    )

    switch (variant) {
      case 'circle':
        const circleSize = responsiveWidth ?? responsiveHeight ?? 40
        return { width: circleSize, height: circleSize }

      case 'text':
        return {
          width: responsiveWidth ?? '100%',
          height: responsiveHeight ?? responsiveTextHeight ?? 16,
        }

      case 'rect':
      default:
        return {
          width: responsiveWidth ?? '100%',
          height: responsiveHeight ?? 100,
        }
    }
  }

  const getBorderRadius = (): number => {
    if (borderRadius !== undefined) {
      return borderRadius
    }

    switch (variant) {
      case 'circle':
        return 9999
      case 'text':
        return 4
      case 'rect':
      default:
        return 8
    }
  }

  const dimensions = getDimensions()
  const finalBorderRadius = getBorderRadius()

  const skeletonStyles: ViewStyle = {
    backgroundColor: finalBackgroundColor,
    width: dimensions.width,
    height: dimensions.height,
    borderRadius: finalBorderRadius,
    overflow: 'hidden',
  }

  const shimmerStyles: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: finalHighlightColor,
  }

  if (variant === 'text' && lines > 1) {
    const responsiveLineSpacing = getResponsiveSize(
      lineSpacing,
      isSmallPhone,
      isLargePhone,
      responsive,
    ) as number

    return (
      <View style={style} testID={testID}>
        {Array.from({ length: lines }).map((_, index) => {
          const isLastLine = index === lines - 1
          const lineWidth = isLastLine ? lastLineWidth : dimensions.width
          return (
            <View
              key={index}
              style={Object.assign(
                {},
                skeletonStyles,
                index > 0 && { marginTop: responsiveLineSpacing },
                { width: lineWidth as DimensionValue },
              )}
              testID={testID ? `${testID}-line-${index}` : undefined}
            >
              {animated && (
                <Animated.View
                  style={Object.assign(
                    {},
                    {
                      transform: [{ translateX }],
                      opacity,
                    },
                    shimmerStyles,
                  )}
                />
              )}
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <View
      style={Object.assign({}, skeletonStyles, style)}
      testID={testID}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="Loading"
    >
      {animated && (
        <Animated.View
          style={Object.assign(
            {},
            {
              transform: [{ translateX }],
              opacity,
            },
            shimmerStyles,
          )}
        />
      )}
    </View>
  )
}
