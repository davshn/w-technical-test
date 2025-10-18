import { StyleSheet } from 'react-native'
import { View, Text, Image, Button, StepperInput } from '../../atom'
import type { CartItemMolProps } from './CardItemProps'
import { formatPrice } from '../../../utils/utils'
import { FontAwesome } from "@react-native-vector-icons/fontawesome"

export const CartItem: React.FC<CartItemMolProps> = ({
  item,
  availableStock,
  onQuantityChange,
  onRemove,
  responsive = false,
  showImage = true,
  testID = 'cart-item',
}) => {

  const subtotal = item.value * item.quantity

  const handleQuantityChange = (newQuantity: number) => {
    if (onQuantityChange) {
      onQuantityChange(item.id, newQuantity)
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item.id)
    }
  }

  return (
    <View
      variant="card"
      padding="sm"
      radius="base"
      style={styles.container}
      testID={testID}
    >
      <View flexDirection="row" style={styles.content}>
        {showImage && (
          <Image
            source={{ uri: item.uri }}
            size="xs"
            aspectRatio="square"
            borderRadius={8}
            responsive={responsive}
            testID={`${testID}-image`}
            style={styles.image}
          />
        )}

        <View flex={1} style={styles.details}>
          <View style={styles.superiorButton}>
            <Button
              variant="icon"
              size="base"
              icon={<FontAwesome name="close" />}
              onPress={handleRemove}
              testID={`${testID}-remove-btn`}
              accessibilityLabel="Remove item from cart"
            />
          </View>
          <View style={styles.header}>
            <Text
              size="sm"
              weight="semibold"
              color="primary"
              numberOfLines={2}
              responsive={responsive}
              testID={`${testID}-name`}
            >
              {item.name}
            </Text>
          </View>
          <View style={styles.header}>
            <Text
              size="xs"
              color="secondary"
              numberOfLines={1}
              responsive={responsive}
              testID={`${testID}-price`}
              style={styles.price}
            >
              {formatPrice(item.value) + ' c/u'}
            </Text>

            <Text
              size="sm"
              weight="bold"
              color="primary"
              responsive={responsive}
              testID={`${testID}-subtotal`}
            >
              {' Subtotal: ' + formatPrice(subtotal)}
            </Text>
          </View>
          <View style={styles.footer}>
            <StepperInput
              value={item.quantity}
              onChange={handleQuantityChange}
              min={1}
              max={availableStock}
              size="sm"
              shape='rounded'
              variant="outlined"
              responsive={responsive}
              testID={`${testID}-stepper`}
            />
          </View>

          {availableStock < 5 && (
            <Text
              size="xs"
              color="warning"
              responsive={responsive}
              testID={`${testID}-stock-warning`}
              style={styles.stockWarning}
            >
              Only {availableStock} left in stock
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  content: {
    gap: 12,
  },
  image: {
    alignSelf: 'flex-start',
  },
  details: {
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  price: {
    marginTop: 2,
  },
  footer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: 40,
  },
  stockWarning: {
    marginTop: 4,
  },
  superiorButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: -10,
  },
})