import { StyleSheet } from 'react-native'
import { View, Text, Badge, Image, Button } from '../../atom'
import type { ProductCardProps } from './ProductCardProps'
import { formatPrice } from '../../../utils/utils';

export const ProductCard: React.FC<ProductCardProps> = ({
product,
  onPress,
  imageAspectRatio = '4:3',
  showStock = true,
  compact = false,
  responsive = false,
  testID,
}) => {
  const { id, name, uri, quantity, value } = product

  const getStockBadgeVariant = (): 'success' | 'warning' | 'error' => {
    if (quantity > 10) return 'success'
    if (quantity > 0) return 'warning'
    return 'error'
  }

  const getStockLabel = (): string => {
    if (quantity === 0) return 'Agotado'
    if (quantity <= 5) return `Solo ${quantity}`
    return `${quantity} disp.`
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
        <Image
          source={{ uri }}
          size="full"
          aspectRatio={imageAspectRatio}
          borderRadius={8}
          resizeMode="cover"
          responsive={responsive}
          showLoader
          testID={testID ? `${testID}-image` : undefined}
        />

        {showStock && (
          <View style={styles.stockBadge}>
            <Badge
              label={getStockLabel()}
              variant={getStockBadgeVariant()}
              size="xs"
              shape="pill"
              responsive={responsive}
            />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>

        <Text
          size={compact ? 'base' : 'lg'}
          weight="semibold"
          color="primary"
          numberOfLines={2}
          responsive={responsive}
          testID={testID ? `${testID}-name` : undefined}
        >
          {name}
        </Text>

        <Text
          size={compact ? 'lg' : 'xl'}
          weight="bold"
          color="primary"
          style={styles.price}
          responsive={responsive}
          testID={testID ? `${testID}-price` : undefined}
        >
          {formatPrice(value)}
        </Text>

        <Button
          variant="primary"
          size={compact ? 'sm' : 'base'}
          title="Ver detalle"
          onPress={() => onPress?.(product)}
          disabled={false}
          responsive={responsive}
          style={styles.detailButton}
          testID={testID ? `${testID}-detail-btn` : undefined}
        />
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
  price: {
    marginTop: 4,
  },
  detailButton: {
    marginTop: 8,
  },
})