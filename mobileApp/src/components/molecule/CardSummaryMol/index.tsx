import { StyleSheet } from 'react-native'
import { View, Text, Divider, Button, Image } from '../../atom'
import type { CartSummaryMolProps } from './CardSummaryProps'
import { FontAwesome } from "@react-native-vector-icons/fontawesome"
import { StepperInput } from '../../atom'

export const CartSummary: React.FC<CartSummaryMolProps> = ({
  subtotal,
  tax = 0,
  discount = 0,
  shipping = 0,
  total,
  itemCount,
  currency = 'COP',
  responsive = false,
  showItemCount = true,
  paymentMethod,
  onAddPaymentMethod,
  onCheckout,
  installments = 1,
  setInstallments,
  testID = 'cart-summary',
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const renderRow = (
    label: string,
    value: number,
    highlight: boolean = false,
    testId?: string,
  ) => (
    <View
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={styles.row}
    >
      <Text
        size={highlight ? 'lg' : 'base'}
        weight={highlight ? 'bold' : 'normal'}
        color={highlight ? 'primary' : 'secondary'}
        responsive={responsive}
      >
        {label}
      </Text>
      <Text
        size={highlight ? 'lg' : 'base'}
        weight={highlight ? 'bold' : 'semibold'}
        color={highlight ? 'primary' : 'primary'}
        responsive={responsive}
        testID={testId}
      >
        {formatPrice(value)}
      </Text>
    </View>
  )

  return (
    <View
      variant="card"
      padding="base"
      radius="base"
      testID={testID}
      style={styles.container}
    >
      <Text
        size="xl"
        weight="bold"
        color="primary"
        responsive={responsive}
        style={styles.title}
      >
        Resumen de pedido
      </Text>

      {showItemCount && itemCount > 0 && (
        <Text
          size="sm"
          color="secondary"
          responsive={responsive}
          style={styles.itemCount}
          testID={`${testID}-item-count`}
        >
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
      )}

      <View style={styles.content}>
        {renderRow('Subtotal', subtotal, false, `${testID}-subtotal`)}

        {tax > 0 && renderRow('Tax', tax, false, `${testID}-tax`)}

        {discount > 0 && renderRow('Discount', -discount, false, `${testID}-discount`)}

        {shipping > 0 && renderRow('Shipping', shipping, false, `${testID}-shipping`)}

        <Divider
          spacing="sm"
          thickness="base"
          responsive={responsive}
          style={styles.divider}
        />

        {renderRow('Total', total, true, `${testID}-total`)}
      </View>

      <Divider
        spacing="base"
        thickness="base"
        responsive={responsive}
        style={styles.divider}
      />

      <View style={styles.paymentSection}>
        <Text
          size="base"
          weight="semibold"
          color="primary"
          responsive={responsive}
          style={styles.paymentLabel}
        >
          Pagar con:
        </Text>

        {!paymentMethod!.lastFourDigits ? (
          <Button
            title="Agregar tarjeta de crédito"
            variant="outline"
            size="base"
            onPress={onAddPaymentMethod}
            responsive={responsive}
            testID={`${testID}-add-payment-btn`}
            style={styles.addPaymentButton}
          />
        ) : (
          <View style={styles.paymentMethodContainer}>
            <View style={styles.cardLogoContainer}>
              {paymentMethod!.cardType === 'VISA' && (<FontAwesome name="cc-visa" size={40} color={'#1a1f71'} testID='cart-summary-card-logo' />)}
              {paymentMethod!.cardType === 'MASTERCARD' && (<FontAwesome name="cc-mastercard" size={40} color={'#eb001b'} testID='cart-summary-card-logo' />)}
              <Text
                size="sm"
                color="secondary"
                responsive={responsive}
                testID={`${testID}-card-number`}
              >
                •••• {paymentMethod!.lastFourDigits}
              </Text>
            </View>
            <Text
              size="sm"
              color="secondary"
              responsive={responsive}
              testID={`${testID}-card-number`}
            >
              Numero de cuotas:
            </Text>
            <StepperInput
              value={installments}
              onChange={setInstallments!}
              min={1}
              max={36}
              size="base"
              variant="outlined"
              responsive={responsive}
              testID={`${testID}-stepper`}
            />
            <Button
              title="Realizar compra"
              variant="primary"
              size="lg"
              onPress={onCheckout}
              responsive={responsive}
              testID={`${testID}-checkout-btn`}
              style={styles.checkoutButton}
            />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    marginBottom: 4,
  },
  itemCount: {
    marginBottom: 12,
  },
  content: {
    gap: 8,
  },
  row: {
    paddingVertical: 4,
  },
  divider: {
    marginVertical: 4,
  },
  paymentSection: {
    marginTop: 8,
    gap: 12,
  },
  paymentLabel: {
    marginBottom: 4,
  },
  addPaymentButton: {
    width: '100%',
  },
  paymentMethodContainer: {
    gap: 16,
  },
  cardLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkoutButton: {
    width: '100%',
  },
})