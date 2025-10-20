import { StyleSheet } from 'react-native'
import { View, Skeleton } from '../../atom'
import type { ProductCardSkeletonProps } from './ProductCardSkeletonProps'

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({
    imageAspectRatio = '4:3',
  compact = false,
  responsive = false,
  animated = true,
  testID,
}) => {

  const getImageHeight = (): number => {
    switch (imageAspectRatio) {
      case 'square':
        return 200
      case '16:9':
        return 150
      case '4:3':
      default:
        return 180
    }
  }

  return (
    <View
      variant="card"
      radius="base"
      padding={compact ? 'sm' : 'base'}
      style={styles.container}
      testID={testID}
    >

      <View style={styles.imageContainer}>
        <Skeleton
          variant="rect"
          width="100%"
          height={getImageHeight()}
          borderRadius={8}
          animated={animated}
          responsive={responsive}
          testID={testID ? `${testID}-image` : undefined}
        />


        <View style={styles.stockBadge}>
          <Skeleton
            variant="rect"
            width={80}
            height={16}
            borderRadius={9999}
            animated={animated}
            responsive={responsive}
            testID={testID ? `${testID}-badge` : undefined}
          />
        </View>
      </View>

      <View style={styles.infoContainer}>

        <Skeleton
          variant="text"
          size={compact ? 'base' : 'lg'}
          lines={2}
          lineSpacing={6}
          lastLineWidth="75%"
          animated={animated}
          responsive={responsive}
          testID={testID ? `${testID}-name` : undefined}
        />

        <View style={styles.priceContainer}>
          <Skeleton
            variant="text"
            size={compact ? 'lg' : 'xl'}
            width="50%"
            animated={animated}
            responsive={responsive}
            testID={testID ? `${testID}-price` : undefined}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Skeleton
            variant="rect"
            width="100%"
            height={compact ? 32 : 40}
            borderRadius={8}
            animated={animated}
            responsive={responsive}
            testID={testID ? `${testID}-detail-btn` : undefined}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  infoContainer: {
    gap: 8,
  },
  priceContainer: {
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 8,
  },
})
