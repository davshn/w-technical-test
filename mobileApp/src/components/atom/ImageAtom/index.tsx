import { useState } from 'react'
import {
  ActivityIndicator,
  DimensionValue,
  ImageStyle,
  PixelRatio,
  Image as RNImage,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type {
  ImageAspectRatio,
  ImageAtomProps,
  ImageSize,
  ImageState,
} from './ImageProps'

const imageSizes: Record<
  ImageSize,
  {
    width: number | string
    height: number
  }
> = {
  xs: {
    width: 40,
    height: 40,
  },
  sm: {
    width: 80,
    height: 80,
  },
  base: {
    width: 120,
    height: 120,
  },
  lg: {
    width: 200,
    height: 200,
  },
  xl: {
    width: 300,
    height: 300,
  },
  full: {
    width: '100%',
    height: 200,
  },
}

const aspectRatios: Record<ImageAspectRatio, number | undefined> = {
  square: 1,
  '4:3': 4 / 3,
  '16:9': 16 / 9,
  '21:9': 21 / 9,
  auto: undefined,
}

const mobileAdjustments = {
  small: 0.85,
  regular: 1,
  large: 1.1,
}

const getResponsiveImageSize = (
  size: ImageSize,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  const baseConfig = imageSizes[size]

  if (!responsive || typeof baseConfig.width === 'string') {
    return baseConfig
  }

  let multiplier = mobileAdjustments.regular

  if (isSmallPhone) {
    multiplier = mobileAdjustments.small
  } else if (isLargePhone) {
    multiplier = mobileAdjustments.large
  }

  return {
    width: PixelRatio.roundToNearestPixel(baseConfig.width * multiplier),
    height: PixelRatio.roundToNearestPixel(baseConfig.height * multiplier),
  }
}

export const Image: React.FC<ImageAtomProps> = ({
  source,
  fallback,
  size = 'base',
  aspectRatio = 'auto',
  resizeMode = 'cover',
  responsive = false,
  borderRadius = 0,
  showLoader = true,
  loaderSize = 'small',
  customWidth,
  customHeight,
  style,
  containerStyle,
  testID,
  onLoadError,
  onLoadSuccess,
  ...rest
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()

  const [imgSource, setImgSource] = useState(source)
  const [imageState, setImageState] = useState<ImageState>('loading')
  const [hasError, setHasError] = useState(false)

  const loaderColor = useThemeColor({}, 'primary')
  const backgroundColor = useThemeColor({}, 'background')
  const placeholderColor = useThemeColor({}, 'tint')

  const responsiveSize = getResponsiveImageSize(
    size,
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  const finalWidth = customWidth ?? responsiveSize.width
  const finalHeight = customHeight ?? responsiveSize.height

  const calculateHeight = () => {
    if (customHeight) return customHeight
    if (aspectRatio === 'auto') return finalHeight

    const ratio = aspectRatios[aspectRatio]
    if (ratio && typeof finalWidth === 'number') {
      return PixelRatio.roundToNearestPixel(finalWidth / ratio)
    }

    return finalHeight
  }

  const handleError = () => {
    if (fallback && imgSource !== fallback) {
      setImgSource(fallback)
      setHasError(true)
      setImageState('loaded')
      onLoadError?.()
    } else {
      setImageState('error')
      onLoadError?.()
    }
  }

  const handleLoad = () => {
    setImageState('loaded')
    if (!hasError) {
      onLoadSuccess?.()
    }
  }

  const handleLoadStart = () => {
    setImageState('loading')
  }

  const containerStyles: ViewStyle = {
    width: finalWidth as DimensionValue,
    height: calculateHeight() as DimensionValue,
    borderRadius,
    overflow: 'hidden',
    backgroundColor:
      imageState === 'error' ? placeholderColor : backgroundColor,
  }

  const imageStyles: ImageStyle = {
    width: '100%',
    height: '100%',
  }

  const loaderContainerStyles: ViewStyle = {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  }

  return (
    <View
      style={Object.assign({}, containerStyle, containerStyles)}
      testID={testID}
      accessible={true}
      accessibilityRole="image"
    >
      {imageState !== 'error' && (
        <RNImage
          source={imgSource}
          resizeMode={resizeMode}
          onError={handleError}
          onLoad={handleLoad}
          onLoadStart={handleLoadStart}
          style={Object.assign({}, imageStyles, style)}
          testID={testID ? `${testID}-image` : undefined}
          {...rest}
        />
      )}

      {imageState === 'loading' && showLoader && (
        <View style={loaderContainerStyles}>
          <ActivityIndicator
            size={loaderSize}
            color={loaderColor}
            testID={testID ? `${testID}-loader` : undefined}
          />
        </View>
      )}
    </View>
  )
}
