import { StyleSheet } from 'react-native'
import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Cart } from '../../components/organism/CartOrg'
import { ToastBase, ActivityIndicator } from '../../components/atom'
import type { RootState } from '../../stateManagement/store'
import type { CardFormData } from '../../components/molecule/AddCardModalMol/AddCardModalProps'
import type { PaymentMethod } from '../../components/organism/CartOrg/CartProps'
import { getAceptanceToken, tokenizeCard, createTransaction } from '../../services/services'
import { addAcceptanceToken, addCustomer, addBrand, addLastFour, addCardToken, addInstallments, addTransactionId } from '../../stateManagement/reducers/transaction.reducer'
import { removeFromCart, updateCartItemQuantity } from '../../stateManagement/reducers/cart.reducer'
import { useNavigation } from '@react-navigation/native'


export default function CartScreen() {
  const dispatch = useDispatch()
  const navigation = useNavigation()


  const cartItems = useSelector((state: RootState) => state.cart.products)
  const products = useSelector((state: RootState) => state.products.products)
  const transaction = useSelector((state: RootState) => { return state.transaction })


  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({ lastFourDigits: transaction.last_four, cardType: transaction.brand as 'VISA' | 'MASTERCARD' })
  const [termsUrl, setTermsUrl] = useState<string>('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)


  const availableProducts = useMemo(() => {
    return products.map(p => ({
      id: p.id,
      quantity: p.quantity
    }))
  }, [products])


  const subtotal = useMemo(() => {
    return cartItems.reduce((sum: any, item: any) => sum + (item.value * item.quantity), 0)
  }, [cartItems])


  const total = useMemo(() => {
    return subtotal
  }, [subtotal])


  const handleQuantityChange = (id: number, quantity: number) => {
    try {
      dispatch(updateCartItemQuantity({ id, quantity }))
      setToastMessage('Cantidad actualizada')
      setToastType('success')
      setToastVisible(true)
    } catch (error) {
      setToastMessage('Error al actualizar cantidad')
      setToastType('error')
      setToastVisible(true)
      console.error('Error updating quantity:', error)
    }
  }


  const handleRemoveItem = (id: number) => {
    try {
      dispatch(removeFromCart(id))
      setToastMessage('Producto eliminado del carrito')
      setToastType('success')
      setToastVisible(true)
    } catch (error) {
      setToastMessage('Error al eliminar producto')
      setToastType('error')
      setToastVisible(true)
      console.error('Error removing item:', error)
    }
  }


  const handleAddPaymentMethod = async () => {
    try {
      const { presigned_acceptance } = await getAceptanceToken()
      dispatch(addAcceptanceToken(presigned_acceptance.acceptance_token))
      setTermsUrl(presigned_acceptance.permalink)
    } catch (error) {
      setToastMessage('Error al obtener token de aceptación')
      setToastType('error')
      setToastVisible(true)
      console.error('Error fetching acceptance token:', error)
    }
  }


  const handleCardAdded = async (cardData: CardFormData) => {
    dispatch(addCustomer(cardData.email))
    const dataCleared = {
      "number": cardData.number.replace(/'/g, '"'),
      "card_holder": cardData.card_holder.replace(/'/g, '"'),
      "exp_month": cardData.exp_month.replace(/'/g, '"'),
      "exp_year": cardData.exp_year.replace(/'/g, '"'),
      "cvc": cardData.cvc.replace(/'/g, '"')
    }
    try {
      const tokenResponse = await tokenizeCard(dataCleared)


      if (tokenResponse.status === 'CREATED') {
        dispatch(addCardToken(tokenResponse.data.id))
        dispatch(addBrand(tokenResponse.data.brand))
        dispatch(addLastFour(tokenResponse.data.last_four))
        setShowPaymentModal(false)
        setPaymentMethod({
          cardType: tokenResponse.data.brand,
          lastFourDigits: tokenResponse.data.last_four,
        })
        setToastMessage('Método de pago agregado exitosamente')
        setToastType('success')
        setToastVisible(true)
      }
    } catch (error) {
      setToastMessage('Error al agregar método de pago, revisa los datos ingresados')
      setToastType('error')
      setToastVisible(true)
      console.error('Error fetching acceptance token:', error)
    }
  }


  const handleInstallmentsChange = (value: number) => {
    dispatch(addInstallments(value))
  }


  const handleCheckout = async () => {
    if (!paymentMethod.cardType) {
      setToastMessage('Por favor agrega un método de pago')
      setToastType('error')
      setToastVisible(true)
      return
    }


    if (cartItems.length === 0) {
      setToastMessage('Tu carrito está vacío')
      setToastType('error')
      setToastVisible(true)
      return
    }


    try {
      const transactionData = {
        "cardToken": transaction.cardToken.replace(/'/g, '"'),
        "customer": transaction.customer.replace(/'/g, '"'),
        "acceptance_token": transaction.acceptance_token.replace(/'/g, '"'),
        "installments": transaction.installments,
        "products": cartItems.map(item => ({
          "productId": item.id,
          "quantity": item.quantity
        }))
      }
      setIsSubmitting(true)
      const response = await createTransaction(transactionData)
      handleAddPaymentMethod()
      dispatch(addTransactionId(response.reference))
      setIsSubmitting(false)
      setToastMessage('Compra procesada exitosamente')
      setToastType('success')
      setToastVisible(true)
      navigation.navigate('PaymentProcessing' as never)
    } catch (error) {
      setIsSubmitting(false)
      handleAddPaymentMethod()
      setToastMessage('Error al procesar la compra, intentalo de nuevo')
      setToastType('error')
      setToastVisible(true)
      console.error('Error processing checkout:', error)
    }
  }


  return (
    <>
      <Cart
        items={cartItems}
        availableProducts={availableProducts}
        subtotal={subtotal}
        total={total}
        paymentMethod={paymentMethod}
        termsUrl={termsUrl}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onAddPaymentMethod={handleAddPaymentMethod}
        onCheckout={handleCheckout}
        responsive
        handleCardAdded={handleCardAdded}
        setShowPaymentModal={setShowPaymentModal}
        showPaymentModal={showPaymentModal}
        installments={transaction.installments}
        setInstallments={handleInstallmentsChange}
      />
      <ToastBase
        message={toastMessage}
        duration={2000}
        variant={toastType}
        visible={toastVisible}
        position="top"
        onHide={() => setToastVisible(false)}
      />
      {isSubmitting && (
        <ActivityIndicator
          overlay
          size="lg"
          variant="primary"
          overlayColor="rgba(0, 0, 0, 0.7)"
          testID={`checkout-loading`}
        />
      )}
    </>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
})

