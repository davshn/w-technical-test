import { StyleSheet } from 'react-native'
import { View, Text, Badge, Image, Button } from '../../atom'
import type { ProductCardProps } from './ProductCardProps'
import { formatPrice } from '../../../utils/utils';

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  imageAspectRatio = '4:3',
  showStock = true,
  compact = false,
  responsive = false,
  testID,
}) => {
  const { id, name, uri, description, quantity, value } = product

  const getStockBadgeVariant = (): 'success' | 'warning' | 'error' => {
    if (quantity > 10) return 'success'
    if (quantity > 0) return 'warning'
    return 'error'
  }

  const getStockLabel = (): string => {
    if (quantity === 0) return 'Agotado'
    if (quantity <= 5) return `Solo ${quantity} disponibles`
    return `${quantity} disponibles`
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
              size="sm"
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
          size="sm"
          color="secondary"
          numberOfLines={compact ? 2 : 3}
          style={styles.description}
          responsive={responsive}
          testID={testID ? `${testID}-description` : undefined}
        >
          {description}
        </Text>

        <Text
          size={compact ? 'xl' : '2xl'}
          weight="bold"
          color="primary"
          style={styles.price}
          responsive={responsive}
          testID={testID ? `${testID}-price` : undefined}
        >
          {formatPrice(value)}
        </Text>

        <View
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          style={styles.actionsContainer}
        >
          <Button
            variant="outline"
            size={compact ? 'sm' : 'base'}
            title="Ver detalle"
            onPress={() => onPress?.(product)}
            disabled={quantity === 0}
            responsive={responsive}
            style={styles.detailButton}
            testID={testID ? `${testID}-detail-btn` : undefined}
          />

          <Button
            variant="primary"
            size={compact ? 'sm' : 'base'}
            title="Agregar"
            onPress={() => onAddToCart?.(product)}
            disabled={quantity === 0}
            responsive={responsive}
            style={styles.addButton}
            testID={testID ? `${testID}-add-btn` : undefined}
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
  description: {
    marginTop: 4,
  },
  price: {
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 12,
    gap: 8,
  },
  detailButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
})
