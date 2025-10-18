import { View, Image, Text, Button, IconButton, Badge } from '../../atom'
import type { ProductDetailModalProps } from './ProductDetailModalProps'
import { formatPrice } from '../../../utils/utils';
import {
  Modal,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  product,
  onClose,
  onAddToCart,
  responsive = true,
  testID = 'product-detail-modal',
}) => {
  if (!product) return null

  const { id, name, uri, description, quantity, value } = product

  const getStockBadgeVariant = (): 'success' | 'warning' | 'error' => {
    if (quantity > 10) return 'success'
    if (quantity > 0) return 'warning'
    return 'error'
  }

  const getStockLabel = (): string => {
    if (quantity === 0) return 'Agotado'
    if (quantity <= 5) return `Solo ${quantity} disponibles`
    return `${quantity} en stock`
  }

  const handleAddToCart = () => {
    onAddToCart?.(product)
    onClose?.()
  }

  const handleBackdropPress = () => {
    onClose?.()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      testID={testID}
    >
      <Pressable
        style={styles.backdrop}
        onPress={handleBackdropPress}
        testID={`${testID}-backdrop`}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            variant="card"
            radius="lg"
            padding="none"
            style={styles.modalContent}
            testID={`${testID}-content`}
          >
            <View style={styles.header}>
              <View flex={1} />
              <IconButton
                icon={
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      backgroundColor: '#666',
                      borderRadius: 12,
                    }}
                    testID="close-icon"
                  />
                }
                size="sm"
                shape="circle"
                onPress={onClose}
                testID={`${testID}-close-btn`}
              />
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri }}
                  size="full"
                  customHeight={250}
                  aspectRatio="16:9"
                  borderRadius={12}
                  resizeMode="cover"
                  responsive={responsive}
                  showLoader
                  testID={`${testID}-image`}
                />

                <View style={styles.stockBadge}>
                  <Badge
                    label={getStockLabel()}
                    variant={getStockBadgeVariant()}
                    size="base"
                    shape="pill"
                    responsive={responsive}
                    testID={`${testID}-stock-badge`}
                  />
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text
                  size="2xl"
                  weight="bold"
                  color="primary"
                  style={styles.productName}
                  responsive={responsive}
                  testID={`${testID}-name`}
                >
                  {name}
                </Text>

                <Text
                  size="2xl"
                  weight="bold"
                  color="success"
                  style={styles.price}
                  responsive={responsive}
                  testID={`${testID}-price`}
                >
                  {formatPrice(value)}
                </Text>

                <View style={styles.divider} />

                <View style={styles.detailsSection}>
                  <Text
                    size="lg"
                    weight="semibold"
                    color="primary"
                    style={styles.sectionTitle}
                    responsive={responsive}
                  >
                    Descripción
                  </Text>

                  <Text
                    size="base"
                    color="secondary"
                    style={styles.description}
                    responsive={responsive}
                    testID={`${testID}-description`}
                  >
                    {description}
                  </Text>
                </View>

                <View style={styles.additionalInfo}>
                  <View style={styles.infoRow}>
                    <Text
                      size="base"
                      weight="semibold"
                      color="primary"
                      responsive={responsive}
                    >
                      ID del producto:
                    </Text>
                    <Text
                      size="base"
                      color="secondary"
                      responsive={responsive}
                    >
                      #{id}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text
                      size="base"
                      weight="semibold"
                      color="primary"
                      responsive={responsive}
                    >
                      Disponibilidad:
                    </Text>
                    <Text
                      size="base"
                      color={quantity > 0 ? 'success' : 'error'}
                      weight="medium"
                      responsive={responsive}
                    >
                      {quantity > 0 ? 'En stock' : 'Agotado'}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                variant="outline"
                size="lg"
                title="Cerrar"
                onPress={onClose}
                style={styles.closeButton}
                responsive={responsive}
                testID={`${testID}-close-footer-btn`}
              />

              <Button
                variant="primary"
                size="lg"
                title="Agregar al carrito"
                onPress={handleAddToCart}
                disabled={quantity === 0}
                style={styles.addButton}
                responsive={responsive}
                testID={`${testID}-add-cart-btn`}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.85,
  },
  modalContent: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  scrollView: {
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.85 - 140, 
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  stockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  infoSection: {
    gap: 8,
  },
  productName: {
    marginBottom: 4,
  },
  price: {
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  detailsSection: {
    gap: 8,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  description: {
    lineHeight: 24,
  },
  additionalInfo: {
    marginTop: 12,
    gap: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  closeButton: {
    flex: 1,
  },
  addButton: {
    flex: 2,
  },
})