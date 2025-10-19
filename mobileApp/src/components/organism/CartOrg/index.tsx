import { FlatList, StyleSheet, ListRenderItem } from 'react-native'
import { View, Text } from '../../atom'
import { CartItem } from '../../molecule/CartItemMol'
import { CartSummary } from '../../molecule/CardSummaryMol'
import { AddCardModal } from '../../molecule/AddCardModalMol'
import type { CartOrgProps, CartItemType } from './CartProps'

const ItemSeparator = () => <View style={styles.separator} />

export const Cart: React.FC<CartOrgProps> = ({
  items = [],
  availableProducts = [],
  subtotal,
  tax = 0,
  discount = 0,
  shipping = 0,
  total,
  paymentMethod,
  termsUrl,
  onQuantityChange,
  onRemoveItem,
  onAddPaymentMethod,
  onCheckout,
  responsive = false,
  emptyMessage = 'Tu carrito está vacío',
  emptyDescription = 'Agrega productos para comenzar tu compra',
  testID = 'cart',
  handleCardAdded,
  showPaymentModal,
  setShowPaymentModal,
  installments,
  setInstallments,
}) => {

  const getAvailableStock = (productId: number): number => {
    const product = availableProducts.find(p => p.id === productId)
    return product?.quantity ?? 0
  }

  const handleAddPaymentMethod = () => {
    if (!setShowPaymentModal) return;
    setShowPaymentModal(true)
    if (onAddPaymentMethod) {
      onAddPaymentMethod()
    }
  }

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer} variant={'outlined'}>
      <Text
        size="3xl"
        weight="bold"
        color="primary"
        align="center"
        responsive={responsive}
        style={styles.emptyIcon}
      >
        🛒
      </Text>
      <Text
        size="xl"
        weight="semibold"
        color="primary"
        align="center"
        responsive={responsive}
        style={styles.emptyTitle}
      >
        {emptyMessage}
      </Text>
      <Text
        size="base"
        color="secondary"
        align="center"
        responsive={responsive}
      >
        {emptyDescription}
      </Text>
    </View>
  )

  const renderItem: ListRenderItem<CartItemType> = ({ item }) => {
    const availableStock = getAvailableStock(item.id)

    return (
      <CartItem
        item={item}
        availableStock={availableStock}
        onQuantityChange={onQuantityChange}
        onRemove={onRemoveItem}
        responsive={responsive}
        testID={`${testID}-item-${item.id}`}
      />
    )
  }

  const renderHeader = () => (
    <View style={styles.header}>
      <Text
        size="3xl"
        weight="bold"
        color="primary"
        responsive={responsive}
      >
        Carrito de Compras
      </Text>
      <Text
        size="base"
        color="secondary"
        responsive={responsive}
        style={styles.itemCount}
      >
        {items.length} {items.length === 1 ? 'producto' : 'productos'}
      </Text>
    </View>
  )

  const renderFooter = () => (
    <View style={styles.footer}>
      <CartSummary
        subtotal={subtotal}
        tax={tax}
        discount={discount}
        shipping={shipping}
        total={total}
        itemCount={items.length}
        paymentMethod={paymentMethod}
        onAddPaymentMethod={handleAddPaymentMethod}
        onCheckout={onCheckout}
        responsive={responsive}
        testID={`${testID}-summary`}
        installments={installments}
        setInstallments={setInstallments!}
      />
    </View>
  )

  if (items.length === 0) {
    return (
      <View style={styles.container} testID={testID} variant={'outlined'}>
        {renderHeader()}
        {renderEmptyCart()}
      </View>
    )
  }

  return (
    <View style={styles.container} testID={testID} variant={'outlined'}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        testID={`${testID}-list`}
      />

      <AddCardModal
        visible={showPaymentModal!}
        onClose={() => setShowPaymentModal!(false)}
        onAddCard={handleCardAdded!}
        termsUrl={termsUrl}
        responsive={responsive}
        testID={`${testID}-payment-modal`}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  itemCount: {
    marginTop: 4,
  },
  separator: {
    height: 12,
  },
  footer: {
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 8,
  },
})