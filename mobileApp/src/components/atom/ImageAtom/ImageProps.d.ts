import type { ViewStyle, ImageStyle } from 'react-native'

export type ImageSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | 'full'

export type ImageAspectRatio = 'square' | '4:3' | '16:9' | '21:9' | 'auto'

export type ImageResizeMode = 'cover' | 'contain' | 'stretch' | 'center'

export type ImageState = 'loading' | 'loaded' | 'error'

export interface ImageAtomProps extends Omit<RNImageProps, 'source' | 'style'> {
  source: { uri: string } | number
  fallback?: { uri: string } | number
  size?: ImageSize
  aspectRatio?: ImageAspectRatio
  resizeMode?: ImageResizeMode
  responsive?: boolean
  borderRadius?: number
  showLoader?: boolean
  loaderSize?: 'small' | 'large'
  customWidth?: number | string
  customHeight?: number | string
  style?: ImageStyle | ImageStyle[]
  containerStyle?: ViewStyle | ViewStyle[]
  testID?: string
  onLoadError?: () => void
  onLoadSuccess?: () => void
}
