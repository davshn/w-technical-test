import { useResponsive } from '../../../hooks/useResponsive'
import { useThemeColor } from '../../../hooks/useThemeColor'
import { PixelRatio, Text as RNText, TextStyle } from 'react-native'
import type {
  FontWeight,
  TextAtomProps,
  TextColor,
  TextSize,
} from './TextProps'

const textSizes: Record<TextSize, number> = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
}

const mobileAdjustments = {
  small: 0.9,
  regular: 1,
  large: 1.05,
}

const getResponsiveFontSize = (
  size: TextSize,
  isSmallPhone: boolean,
  isLargePhone: boolean,
  responsive = false,
): number => {
  let fontSize = textSizes[size]

  if (!responsive) return fontSize

  if (isSmallPhone) {
    fontSize *= mobileAdjustments.small
  } else if (isLargePhone) {
    fontSize *= mobileAdjustments.large
  }
  return PixelRatio.roundToNearestPixel(fontSize)
}

const getLineHeight = (fontSize: number): number => {
  return PixelRatio.roundToNearestPixel(fontSize * 1.4)
}

const fontWeights: Record<FontWeight, TextStyle['fontWeight']> = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

export const Text: React.FC<TextAtomProps> = ({
  children,
  size = 'base',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  responsive = false,
  italic = false,
  underline = false,
  strikethrough = false,
  style,
  testID,
  ...rest
}) => {
  const { isSmallPhone, isLargePhone } = useResponsive()
  const fontSize = getResponsiveFontSize(
    size,
    isSmallPhone,
    isLargePhone,
    responsive,
  )
  const lineHeight = getLineHeight(fontSize)
  const textColors: Record<TextColor, string> = {
    primary: useThemeColor({}, 'textPrimary'),
    secondary: useThemeColor({}, 'textSecondary'),
    success: useThemeColor({}, 'success'),
    warning: useThemeColor({}, 'warning'),
    error: useThemeColor({}, 'error'),
    muted: useThemeColor({}, 'disabled'),
    white: useThemeColor({}, 'white'),
  }

  const textStyle: TextStyle = {
    fontSize: fontSize,
    fontWeight: fontWeights[weight],
    lineHeight,
    color: textColors[color],
    textAlign: align,
    fontStyle: italic ? 'italic' : 'normal',
    textDecorationLine:
      underline && strikethrough
        ? 'underline line-through'
        : underline
          ? 'underline'
          : strikethrough
            ? 'line-through'
            : 'none',
  }

  const finalStyles = { ...textStyle, ...style }

  return (
    <RNText
      style={finalStyles}
      testID={testID}
      accessible={true}
      accessibilityRole="text"
      {...rest}
    >
      {children}
    </RNText>
  )
}
