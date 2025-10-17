import { Platform, ScrollView, StatusBar, View, ViewStyle } from 'react-native'

import { useThemeColor } from '../../../hooks/useThemeColor'
import type { SafeAreaAtomProps } from './SafeAreaAtomProps'

export const SafeArea: React.FC<SafeAreaAtomProps> = ({
  variant = 'default',
  edges = ['top', 'bottom', 'left', 'right'],
  mode = 'padding',
  backgroundColor,
  statusBarColor,
  statusBarStyle = 'default',
  includeStatusBar = true,
  flex = 1,
  style,
  testID,
  children,
  ...rest
}) => {
  const defaultBackground = useThemeColor({}, 'background')
  const primaryBackground = useThemeColor({}, 'primary')
  const secondaryBackground = useThemeColor({}, 'secondary')

  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor

    switch (variant) {
      case 'primary':
        return primaryBackground
      case 'secondary':
        return secondaryBackground
      case 'transparent':
        return 'transparent'
      default:
        return defaultBackground
    }
  }

  const finalBackgroundColor = getBackgroundColor()

  const getEdgeSpacing = () => {
    const spacing: ViewStyle = {}
    const value = 24

    if (mode === 'padding') {
      if (edges.includes('top')) spacing.paddingTop = value
      if (edges.includes('bottom')) spacing.paddingBottom = value
      if (edges.includes('left')) spacing.paddingLeft = value
      if (edges.includes('right')) spacing.paddingRight = value
    } else {
      if (edges.includes('top')) spacing.marginTop = value
      if (edges.includes('bottom')) spacing.marginBottom = value
      if (edges.includes('left')) spacing.marginLeft = value
      if (edges.includes('right')) spacing.marginRight = value
    }

    return spacing
  }

  const containerStyles: ViewStyle = {
    flex,
    backgroundColor: finalBackgroundColor,
    gap: 16,
    ...getEdgeSpacing(),
  }

  const getAndroidStatusBarPadding = (): ViewStyle => {
    if (
      Platform.OS !== 'android' ||
      !includeStatusBar ||
      !edges.includes('top')
    ) {
      return {}
    }

    const statusBarHeight = StatusBar.currentHeight ?? 0

    if (mode === 'padding') {
      return {
        paddingTop:
          ((containerStyles.paddingTop as number) || 0) + statusBarHeight,
      }
    } else {
      return {
        marginTop:
          ((containerStyles.marginTop as number) || 0) + statusBarHeight,
      }
    }
  }

  const edgeStyles: ViewStyle = {
    ...getAndroidStatusBarPadding(),
  }

  const finalStyles = { ...containerStyles, ...edgeStyles, ...style }

  return (
    <ScrollView
      bounces={false}
      overScrollMode="never"
      style={{ backgroundColor: finalBackgroundColor }}
    >
      <View style={finalStyles} testID={testID} {...rest}>
        {children}
      </View>
    </ScrollView>
  )
}
