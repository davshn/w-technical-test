import { DimensionValue, PixelRatio, View, ViewStyle } from 'react-native'

import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type {
  DividerAtomProps,
  DividerSpacing,
  DividerThickness,
} from './DividerProps'

const dividerThickness: Record<DividerThickness, number> = {
  thin: 1,
  base: 2,
  thick: 4,
}

const dividerSpacing: Record<DividerSpacing, number> = {
  none: 0,
  xs: 4,
  sm: 8,
  base: 16,
  lg: 24,
  xl: 32,
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.1,
}

const getResponsiveDividerSize = (
  thickness: DividerThickness,
  spacing: DividerSpacing,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
) => {
  const baseThickness = dividerThickness[thickness]
  const baseSpacing = dividerSpacing[spacing]

  if (!responsive) {
    return { thickness: baseThickness, spacing: baseSpacing }
  }

  let multiplier = mobileAdjustments.regular

  if (isSmallPhone) {
    multiplier = mobileAdjustments.small
  } else if (isLargePhone) {
    multiplier = mobileAdjustments.large
  }

  return {
    thickness: PixelRatio.roundToNearestPixel(baseThickness * multiplier),
    spacing: PixelRatio.roundToNearestPixel(baseSpacing * multiplier),
  }
}

export const Divider: React.FC<DividerAtomProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 'base',
  spacing = 'base',
  color,
  length = '100%',
  responsive = false,
  style,
  testID,
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()

  const dividerColor = useThemeColor({}, 'primary')
  const finalColor = color ?? dividerColor

  const responsiveSize = getResponsiveDividerSize(
    thickness,
    spacing,
    isSmallPhone,
    isLargePhone,
    responsive,
  )

  const getDividerStyles = (): ViewStyle => {
    const isHorizontal = orientation === 'horizontal'

    const baseStyles: ViewStyle = {
      backgroundColor: variant === 'solid' ? finalColor : 'transparent',
    }

    if (isHorizontal) {
      return {
        ...baseStyles,
        width: length as DimensionValue,
        height: responsiveSize.thickness,
        marginVertical: responsiveSize.spacing,
      }
    } else {
      return {
        ...baseStyles,
        width: responsiveSize.thickness,
        height: length as DimensionValue,
        marginHorizontal: responsiveSize.spacing,
      }
    }
  }

  const getVariantStyles = (): ViewStyle => {
    if (variant === 'solid') return {}

    const isHorizontal = orientation === 'horizontal'

    if (variant === 'dashed') {
      return {
        borderStyle: 'dashed',
        borderColor: finalColor,
        backgroundColor: 'transparent',
        ...(isHorizontal
          ? { borderTopWidth: responsiveSize.thickness }
          : { borderLeftWidth: responsiveSize.thickness }),
      }
    }

    if (variant === 'dotted') {
      return {
        borderStyle: 'dotted',
        borderColor: finalColor,
        backgroundColor: 'transparent',
        ...(isHorizontal
          ? { borderTopWidth: responsiveSize.thickness }
          : { borderLeftWidth: responsiveSize.thickness }),
      }
    }

    return {}
  }

  const dividerStyles = {
    ...getDividerStyles(),
    ...getVariantStyles(),
    ...style,
  }

  return (
    <View
      style={dividerStyles}
      testID={testID}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="divider"
    />
  )
}
