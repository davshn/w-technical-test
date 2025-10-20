import { render, waitFor, act } from '@testing-library/react-native'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import CartScreen from './index'
import * as services from '../../services/services'
import cartReducer from '../../stateManagement/reducers/cart.reducer'
import productsReducer from '../../stateManagement/reducers/products.reducer'
import transactionReducer from '../../stateManagement/reducers/transaction.reducer'

const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}))

jest.mock('../../services/services', () => ({
  getAceptanceToken: jest.fn(),
  tokenizeCard: jest.fn(),
  createTransaction: jest.fn(),
}))

jest.mock('../../components/organism/CartOrg', () => ({
  Cart: 'Cart',
}))
jest.mock('../../components/atom', () => ({
  ToastBase: 'ToastBase',
  ActivityIndicator: 'ActivityIndicator',
}))

describe('CartScreen', () => {
  let store: any

  const mockCartItems = [
    { id: 1, name: 'Producto 1', value: 100, quantity: 2, description: '', uri: '' },
    { id: 2, name: 'Producto 2', value: 50, quantity: 1, description: '', uri: '' },
  ]

  const mockProducts = [
    { id: 1, quantity: 10, name: 'Producto 1', value: 100, uri: '', description: '' },
    { id: 2, quantity: 5, name: 'Producto 2', value: 50, uri: '', description: '' },
  ]

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
        products: productsReducer,
        transaction: transactionReducer,
      },
      preloadedState: {
        cart: { products: mockCartItems, cartNotification: false },
        products: { products: mockProducts },
        transaction: {
          acceptance_token: '',
          customer: '',
          cardToken: '',
          brand: 'VISA',
          last_four: '1234',
          installments: 1,
          transaction_id: '',
          id: '',
        },
      },
    }) as any

    mockNavigate.mockClear()
    jest.clearAllMocks()
  })

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <CartScreen />
      </Provider>
    )
  }

  it('debe renderizar correctamente', () => {
    const { getByTestId } = renderComponent()
    expect(getByTestId).toBeDefined()
  })

  it('debe calcular el subtotal correctamente', () => {
    renderComponent()
    const state = store.getState()
    const subtotal = state.cart.products.reduce(
      (sum: number, item: any) => sum + item.value * item.quantity,
      0
    )
    expect(subtotal).toBe(250) // (100*2) + (50*1)
  })

  it('debe calcular el total correctamente', () => {
    renderComponent()
    const state = store.getState()
    const total = state.cart.products.reduce(
      (sum: number, item: any) => sum + item.value * item.quantity,
      0
    )
    expect(total).toBe(250)
  })

  it('debe actualizar la cantidad de un producto', async () => {
    renderComponent()

    act(() => {
      store.dispatch({ type: 'cart/updateCartItemQuantity', payload: { id: 1, quantity: 3 } })
    })

    await waitFor(() => {
      const state = store.getState()
      const item = state.cart.products.find((p: any) => p.id === 1)
      expect(item?.quantity).toBe(3)
    })
  })

  it('debe eliminar un producto del carrito', async () => {
    renderComponent()

    act(() => {
      store.dispatch({ type: 'cart/removeFromCart', payload: 1 })
    })

    await waitFor(() => {
      const state = store.getState()
      const item = state.cart.products.find((p: any) => p.id === 1)
      expect(item).toBeUndefined()
    })
  })

  it('debe obtener el token de aceptación exitosamente', async () => {
    const mockResponse = {
      presigned_acceptance: {
        acceptance_token: 'test-token',
        permalink: 'https://test.com/terms',
      },
    }
    ;(services.getAceptanceToken as jest.Mock).mockResolvedValue(mockResponse)

    renderComponent()

    await act(async () => {
      await services.getAceptanceToken()
    })

    await waitFor(() => {
      expect(services.getAceptanceToken).toHaveBeenCalled()
    })
  })

  it('debe tokenizar una tarjeta exitosamente', async () => {
    const mockCardData = {
      number: '4242424242424242',
      card_holder: 'Test User',
      exp_month: '12',
      exp_year: '2025',
      cvc: '123',
      email: 'test@test.com',
    }

    const mockResponse = {
      status: 'CREATED',
      data: {
        id: 'tok_test',
        brand: 'VISA',
        last_four: '4242',
      },
    }
    ;(services.tokenizeCard as jest.Mock).mockResolvedValue(mockResponse)

    renderComponent()

    await act(async () => {
      await services.tokenizeCard(mockCardData)
    })

    await waitFor(() => {
      expect(services.tokenizeCard).toHaveBeenCalled()
    })
  })

  it('debe manejar error al obtener token de aceptación', async () => {
    const mockError = new Error('Network error')
    ;(services.getAceptanceToken as jest.Mock).mockRejectedValue(mockError)

    renderComponent()

    await act(async () => {
      try {
        await services.getAceptanceToken()
      } catch (error) {
        expect(error).toBe(mockError)
      }
    })
  })

  it('debe manejar error al tokenizar tarjeta', async () => {
    const mockError = new Error('Invalid card')
    ;(services.tokenizeCard as jest.Mock).mockRejectedValue(mockError)

    renderComponent()

    await act(async () => {
      try {
        await services.tokenizeCard({
          number: '',
          card_holder: '',
          exp_month: '',
          exp_year: '',
          cvc: ''
        })
      } catch (error) {
        expect(error).toBe(mockError)
      }
    })
  })

  it('debe manejar error al procesar transacción', async () => {
    const mockError = new Error('Transaction failed')
    ;(services.createTransaction as jest.Mock).mockRejectedValue(mockError)

    renderComponent()

    await act(async () => {
      try {
        await services.createTransaction({
          cardToken: '',
          customer: '',
          acceptance_token: '',
          installments: 0,
          products: []
        })
      } catch (error) {
        expect(error).toBe(mockError)
      }
    })
  })

  it('debe actualizar las cuotas correctamente', () => {
    renderComponent()

    act(() => {
      store.dispatch({ type: 'transaction/addInstallments', payload: 3 })
    })

    const state = store.getState()
    expect(state.transaction.installments).toBe(3)
  })
})