import { PixelRatio, View, ViewStyle } from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import type { SpacerAtomProps, SpacerSize } from './SpacerProps'

const spacerSizes: Record<SpacerSize, number> = {
  xs: 4,
  sm: 8,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
}

const mobileAdjustments = {
  small: 0.85,
  regular: 1,
  large: 1.15,
}

const getResponsiveSpacerSize = (
  size: SpacerSize,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  const baseSize = spacerSizes[size]

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

export const Spacer: React.FC<SpacerAtomProps> = ({
  size = 'base',
  direction = 'vertical',
  customSize,
  responsive = false,
  flex,
  testID,
  ...rest
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()

  const responsiveSize = getResponsiveSpacerSize(
    size,
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  const finalSize = customSize ?? responsiveSize

  const spacerStyles: ViewStyle = {
    ...(flex !== undefined && { flex }),
    ...(direction === 'vertical' && {
      height: finalSize,
      width: '100%',
    }),
    ...(direction === 'horizontal' && {
      width: finalSize,
      height: '100%',
    }),
  }

  return (
    <View style={spacerStyles} testID={testID} accessible={false} {...rest} />
  )
}
