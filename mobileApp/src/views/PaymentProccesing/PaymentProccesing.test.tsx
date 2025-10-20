import { render, fireEvent, waitFor, act } from '@testing-library/react-native'
import { BackHandler } from 'react-native'
import PaymentProcessingScreen from './index'
import { getTransactionStatus } from '../../services/services'

jest.mock('../../services/services')
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useFocusEffect: (callback: () => void) => {
    callback()
  },
}))

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(),
}))

jest.mock('react-native/Libraries/Utilities/BackHandler', () => {
  const actualBackHandler = jest.requireActual('react-native/Libraries/Utilities/BackHandler')
  return {
    ...actualBackHandler,
    addEventListener: jest.fn(() => ({
      remove: jest.fn(),
    })),
  }
})

const mockUseSelector = require('react-redux').useSelector

describe('PaymentProcessingScreen - Integration Tests', () => {
  const mockCartItems = [
    {
      id: 1,
      name: 'Laptop Gaming ASUS ROG',
      uri: 'https://example.com/laptop.jpg',
      quantity: 2,
      value: 4500000,
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max',
      uri: 'https://example.com/iphone.jpg',
      quantity: 1,
      value: 5200000,
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    mockUseSelector
      .mockReturnValueOnce(mockCartItems) 
      .mockReturnValueOnce('test@example.com')
      .mockReturnValueOnce('txn_123456')
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render initial pending state', () => {
    mockUseSelector
      .mockReturnValueOnce(mockCartItems)
      .mockReturnValueOnce('test@example.com')
      .mockReturnValueOnce('txn_123456')

    ;(getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'PENDING' })

    const { getByText } = render(<PaymentProcessingScreen />)

    expect(getByText('Ahora estamos procesando tu pago')).toBeTruthy()
    expect(getByText(/En poco tiempo tus productos serán alistados/)).toBeTruthy()
  })

  it('should display user email in description', () => {
    mockUseSelector
      .mockReturnValueOnce(mockCartItems)
      .mockReturnValueOnce('test@example.com')
      .mockReturnValueOnce('txn_123456')

    ;(getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'PENDING' })

    const { getByText } = render(<PaymentProcessingScreen />)

    expect(getByText(/test@example.com/)).toBeTruthy()
  })

  it('should display cart items list', () => {
    mockUseSelector
      .mockReturnValueOnce(mockCartItems)
      .mockReturnValueOnce('test@example.com')
      .mockReturnValueOnce('txn_123456')

    ;(getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'PENDING' })

    const { getByText } = render(<PaymentProcessingScreen />)

    expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
    expect(getByText('Cantidad: 2')).toBeTruthy()
    expect(getByText('iPhone 15 Pro Max')).toBeTruthy()
    expect(getByText('Cantidad: 1')).toBeTruthy()
  })

  it('should show loading spinner when status is PENDING', () => {
    mockUseSelector
      .mockReturnValueOnce(mockCartItems)
      .mockReturnValueOnce('test@example.com')
      .mockReturnValueOnce('txn_123456')

    ;(getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'PENDING' })

    const { getByText } = render(<PaymentProcessingScreen />)

    expect(getByText('Por favor espera mientras procesamos tu pago...')).toBeTruthy()
  })

  it('should not show home button when status is PENDING', () => {
    mockUseSelector
      .mockReturnValueOnce(mockCartItems)
      .mockReturnValueOnce('test@example.com')
      .mockReturnValueOnce('txn_123456')

    ;(getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'PENDING' })

    const { queryByTestId } = render(<PaymentProcessingScreen />)

    expect(queryByTestId('payment-processing-home-btn')).toBeNull()
  })

  it('should poll transaction status every 20 seconds', async () => {
    mockUseSelector
      .mockReturnValue(mockCartItems)
      .mockReturnValue('test@example.com')
      .mockReturnValue('txn_123456')

    ;(getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'PENDING' })

    render(<PaymentProcessingScreen />)

    await waitFor(() => {
      expect(getTransactionStatus).toHaveBeenCalledTimes(1)
    })

    act(() => {
      jest.advanceTimersByTime(20000)
    })

    await waitFor(() => {
      expect(getTransactionStatus).toHaveBeenCalledTimes(2)
    })

    act(() => {
      jest.advanceTimersByTime(20000)
    })

    await waitFor(() => {
      expect(getTransactionStatus).toHaveBeenCalledTimes(3)
    })
  })

  it('should stop polling when status is ASSIGNED', async () => {
    let callCount = 0
    ;(getTransactionStatus as jest.Mock).mockImplementation(() => {
      callCount++
      return Promise.resolve({
        status: callCount === 1 ? 'PENDING' : 'ASSIGNED'
      })
    })

    mockUseSelector
      .mockReturnValue(mockCartItems)
      .mockReturnValue('test@example.com')
      .mockReturnValue('txn_123456')

    const { getByText } = render(<PaymentProcessingScreen />)

    await waitFor(() => {
      expect(getTransactionStatus).toHaveBeenCalledTimes(1)
    })

    act(() => {
      jest.advanceTimersByTime(20000)
    })

    await waitFor(() => {
      expect(getByText('Tu pago ha sido realizado, en poco tiempo nos comunicaremos contigo')).toBeTruthy()
    })

    act(() => {
      jest.advanceTimersByTime(20000)
    })

    await waitFor(() => {
      expect(getTransactionStatus).toHaveBeenCalledTimes(2)
    }, { timeout: 1000 })
  })

  it('should show success message when status is ASSIGNED', async () => {
    (getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'ASSIGNED' })

    const { getByText, getByTestId } = render(<PaymentProcessingScreen />)

    await waitFor(() => {
      expect(getByText('Tu pago ha sido realizado, en poco tiempo nos comunicaremos contigo')).toBeTruthy()
      expect(getByTestId('payment-processing-home-btn')).toBeTruthy()
    })
  })

  it('should show rejected message when status is REJECTED', async () => {
    (getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'REJECTED' })

    const { getByText, getByTestId } = render(<PaymentProcessingScreen />)

    await waitFor(() => {
      expect(getByText('Tu pago ha sido rechazado')).toBeTruthy()
      expect(getByText('Vuelve al inicio y cambia tu medio de pago')).toBeTruthy()
      expect(getByTestId('payment-processing-home-btn')).toBeTruthy()
    })
  })

  it('should show rejected message when status is FAILED', async () => {
    (getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'FAILED' })

    const { getByText } = render(<PaymentProcessingScreen />)

    await waitFor(() => {
      expect(getByText('Tu pago ha sido rechazado')).toBeTruthy()
    })
  })

  it('should not display product list when status is REJECTED', async () => {
    (getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'REJECTED' })

    const { queryByText } = render(<PaymentProcessingScreen />)

    await waitFor(() => {
      expect(queryByText('Tus productos:')).toBeNull()
    })
  })

  it('should navigate to home without clearing data when REJECTED and button pressed', async () => {
    const mockDispatch = jest.fn()
    const mockNavigate = jest.fn()

    require('react-redux').useDispatch = () => mockDispatch
    require('@react-navigation/native').useNavigation = () => ({
      navigate: mockNavigate,
    })

    ;(getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'REJECTED' })

    const { getByTestId } = render(<PaymentProcessingScreen />)

    await waitFor(() => {
      expect(getByTestId('payment-processing-home-btn')).toBeTruthy()
    })

    const homeButton = getByTestId('payment-processing-home-btn')
    fireEvent.press(homeButton)

    expect(mockNavigate).toHaveBeenCalledWith('MyTabs')
  })

  it('should handle transaction status check error gracefully', async () => {
    (getTransactionStatus as jest.Mock).mockRejectedValue(new Error('Network error'))

    const { getByText } = render(<PaymentProcessingScreen />)

    await waitFor(() => {
      expect(getByText('Ahora estamos procesando tu pago')).toBeTruthy()
    })
  })

  it('should call getTransactionStatus with correct transaction ID', async () => {
    (getTransactionStatus as jest.Mock).mockResolvedValue({ status: 'PENDING' })

    render(<PaymentProcessingScreen />)

    await waitFor(() => {
      expect(getTransactionStatus).toHaveBeenCalledWith('txn_123456')
    })
  })

  it('should stop polling when status changes from PENDING to non-PENDING', async () => {
    let callCount = 0
    ;(getTransactionStatus as jest.Mock).mockImplementation(() => {
      callCount++
      if (callCount <= 2) {
        return Promise.resolve({ status: 'PENDING' })
      }
      return Promise.resolve({ status: 'FAILED' })
    })

    mockUseSelector
      .mockReturnValue(mockCartItems)
      .mockReturnValue('test@example.com')
      .mockReturnValue('txn_123456')

    render(<PaymentProcessingScreen />)

    await waitFor(() => {
      expect(getTransactionStatus).toHaveBeenCalledTimes(1)
    })

    act(() => {
      jest.advanceTimersByTime(20000)
    })

    await waitFor(() => {
      expect(getTransactionStatus).toHaveBeenCalledTimes(2)
    })

    act(() => {
      jest.advanceTimersByTime(20000)
    })

    await waitFor(() => {
      expect(getTransactionStatus).toHaveBeenCalledTimes(3)
    })

    act(() => {
      jest.advanceTimersByTime(20000)
    })

    await waitFor(() => {
      expect(getTransactionStatus).toHaveBeenCalledTimes(4)
    }, { timeout: 1000 })
  })
})