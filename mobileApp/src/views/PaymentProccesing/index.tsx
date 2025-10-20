import { StyleSheet, BackHandler, ScrollView } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { View, Text, Button, ActivityIndicator, Image } from '../../components/atom'
import { clearCart } from '../../stateManagement/reducers/cart.reducer'
import { clearTransactions } from '../../stateManagement/reducers/transaction.reducer'
import { getTransactionStatus } from '../../services/services'
import type { RootState } from '../../stateManagement/store'

type TransactionStatus = 'PENDING' | 'ASSIGNED' | 'REJECTED' | 'FAILED'

export default function PaymentProcessingScreen() {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const cartItems = useSelector((state: RootState) => state.cart.products)
  const userEmail = useSelector((state: RootState) => state.transaction.customer)
  const transactionId = useSelector((state: RootState) => state.transaction.id)

  const [status, setStatus] = useState<TransactionStatus>('PENDING')
  const [isPolling, setIsPolling] = useState(true)

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true
      }

      const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => backHandler.remove()
    }, [])
  )

  useEffect(() => {
    const checkStatus = async () => {
      if (!isPolling || !transactionId) return

      try {
        const response = await getTransactionStatus(transactionId)
        const newStatus = response.status as TransactionStatus

        if (newStatus !== 'PENDING') {
          setIsPolling(false)
        }

        setStatus(newStatus)
      } catch (error) {
        console.error('Error checking transaction status:', error)
      }
    }

    const interval = setInterval(() => {
      if (isPolling) {
        checkStatus()
      }
    }, 20000)

    checkStatus()

    return () => clearInterval(interval)
  }, [isPolling, transactionId])

  const handleGoHome = () => {
    if (status === 'ASSIGNED') {
      dispatch(clearCart())
      dispatch(clearTransactions())
    }
    navigation.navigate('MyTabs' as never)
  }

  const getStatusTitle = () => {
    switch (status) {
      case 'PENDING':
        return 'Ahora estamos procesando tu pago'
      case 'ASSIGNED':
        return 'Tu pago ha sido realizado, en poco tiempo nos comunicaremos contigo'
      default:
        return 'Tu pago ha sido rechazado'
    }
  }

  const getStatusDescription = () => {
    switch (status) {
      case 'PENDING':
      case 'ASSIGNED':
        return `En poco tiempo tus productos serán alistados por nuestro personal, nos comunicaremos a ${userEmail} para coordinar el envío`
      default:
        return 'Vuelve al inicio y cambia tu medio de pago'
    }
  }

  const renderProductList = () => {
    if (status !== 'PENDING' && status !== 'ASSIGNED') return null

    return (
      <View style={styles.productsContainer}>
        <Text
          size="lg"
          weight="semibold"
          color="primary"
          style={styles.productsTitle}
        >
          Tus productos:
        </Text>
        {cartItems.map((item) => (
          <View key={item.id} variant="card" padding="sm" style={styles.productCard}>
            <Image
              source={{ uri: item.uri }}
              size="xs"
              aspectRatio="square"
              borderRadius={8}
            />
            <View style={styles.productInfo}>
              <Text size="sm" weight="semibold" color="primary">
                {item.name}
              </Text>
              <Text size="xs" color="secondary">
                Cantidad: {item.quantity}
              </Text>
            </View>
          </View>
        ))}
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container} variant={'outlined'}>
        <View style={styles.content}>
          {status === 'PENDING' && (
            <ActivityIndicator
              size="xl"
              variant="primary"
              style={styles.spinner}
            />
          )}

          {status === 'ASSIGNED' && (
            <Text style={styles.successIcon}>✓</Text>
          )}

          {status !== 'PENDING' && status !== 'ASSIGNED' && (
            <Text style={styles.errorIcon}>✕</Text>
          )}

          <Text
            size="2xl"
            weight="bold"
            color="primary"
            align="center"
            style={styles.title}
          >
            {getStatusTitle()}
          </Text>

          <Text
            size="base"
            color="secondary"
            align="center"
            style={styles.description}
          >
            {getStatusDescription()}
          </Text>

          {renderProductList()}

          {status !== 'PENDING' && (
            <Button
              title="Volver al inicio"
              variant="primary"
              size="lg"
              onPress={handleGoHome}
              style={styles.button}
              testID="payment-processing-home-btn"
            />
          )}

          {status === 'PENDING' && (
            <Text
              size="sm"
              color="secondary"
              align="center"
              style={styles.waitMessage}
            >
              Por favor espera mientras procesamos tu pago...
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 32,
  },
  successIcon: {
    fontSize: 80,
    color: '#4CAF50',
    marginBottom: 24,
    height: 80,
  },
  errorIcon: {
    fontSize: 80,
    color: '#F44336',
    marginBottom: 24,
    height: 80,
  },
  title: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  description: {
    marginBottom: 32,
    paddingHorizontal: 24,
    lineHeight: 24,
  },
  productsContainer: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 32,
  },
  productsTitle: {
    marginBottom: 16,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  productInfo: {
    flex: 1,
    gap: 4,
  },
  button: {
    width: '100%',
    maxWidth: 400,
  },
  waitMessage: {
    marginTop: 24,
  },
})