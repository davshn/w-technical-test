jest.mock('../../services/services', () => ({
  fetchProducts: jest.fn(),
}))

import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import HomeScreen from './index'
import { fetchProducts } from '../../services/services'
import productsReducer from '../../stateManagement/reducers/products.reducer'
import cartReducer from '../../stateManagement/reducers/cart.reducer'
import type { Product } from '../../components/molecule/ProductCardMol/ProductCardProps'

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Laptop Gaming ASUS ROG',
    uri: 'https://example.com/1.jpg',
    description: 'High performance laptop',
    quantity: 15,
    value: 4500000,
  },
  {
    id: 2,
    name: 'iPhone 15 Pro Max',
    uri: 'https://example.com/2.jpg',
    description: 'Apple Smartphone',
    quantity: 8,
    value: 5200000,
  },
]

describe('HomeScreen - Integration Tests', () => {
  let store: any

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetchProducts as jest.Mock).mockResolvedValue(mockProducts)
    store = configureStore({
      reducer: {
        products: productsReducer,
        cart: cartReducer,
      },
    })
  })

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<Provider store={store}>{component}</Provider>)
  }

  it('should load and display products on mount', async () => {
    const { getByText } = renderWithProvider(<HomeScreen />)

    await waitFor(() => {
      expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
      expect(getByText('iPhone 15 Pro Max')).toBeTruthy()
    })

    expect(fetchProducts).toHaveBeenCalledTimes(1)
  })

  it('should show loading state while fetching products', async () => {
    (fetchProducts as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    )

    const { getByTestId } = renderWithProvider(<HomeScreen />)

    await waitFor(() => {
      expect(getByTestId('product-list-screen-skeleton-0')).toBeTruthy()
    })
  })

  it('should open product detail modal when product is pressed', async () => {
    const { getByTestId, getByText } = renderWithProvider(<HomeScreen />)

    await waitFor(() => {
      expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
    })

    const detailButton = getByTestId('product-list-screen-product-0-detail-btn')
    fireEvent.press(detailButton)

    await waitFor(() => {
      expect(getByTestId('product-detail-modal')).toBeTruthy()
    })
  })

  it('should close product detail modal when close button is pressed', async () => {
    const { getByTestId, queryByTestId } = renderWithProvider(<HomeScreen />)

    await waitFor(() => {
      expect(getByTestId('product-list-screen-product-0-detail-btn')).toBeTruthy()
    })

    const detailButton = getByTestId('product-list-screen-product-0-detail-btn')
    fireEvent.press(detailButton)

    await waitFor(() => {
      expect(getByTestId('product-detail-modal')).toBeTruthy()
    })

    const closeButton = getByTestId('product-detail-modal-close-btn')
    fireEvent.press(closeButton)

    await waitFor(() => {
      expect(queryByTestId('product-detail-modal')).toBeNull()
    })
  })

  it('should refresh products when pull to refresh is triggered', async () => {
    const { getByTestId } = renderWithProvider(<HomeScreen />)

    await waitFor(() => {
      expect(getByTestId('product-list-screen-list')).toBeTruthy()
    })

    const list = getByTestId('product-list-screen-list')
    fireEvent(list, 'refresh')

    await waitFor(() => {
      expect(fetchProducts).toHaveBeenCalledTimes(2)
    })
  })

  it('should update Redux store with fetched products', async () => {
    renderWithProvider(<HomeScreen />)

    await waitFor(() => {
      const state = store.getState()
      expect(state.products.products).toEqual(mockProducts)
    })
  })

  it('should display products from Redux store', async () => {
    const { getByText } = renderWithProvider(<HomeScreen />)

    await waitFor(() => {
      expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
      expect(getByText('iPhone 15 Pro Max')).toBeTruthy()
    })

    const state = store.getState()
    expect(state.products.products).toHaveLength(2)
  })

  it('should show product detail modal with correct product data', async () => {
    const { getByTestId, getAllByText } = renderWithProvider(<HomeScreen />)

    await waitFor(() => {
      expect(getByTestId('product-list-screen-product-1-detail-btn')).toBeTruthy()
    })

    const detailButton = getByTestId('product-list-screen-product-1-detail-btn')
    fireEvent.press(detailButton)

    await waitFor(() => {
      expect(getByTestId('product-detail-modal')).toBeTruthy()
    })

    await waitFor(() => {
      const iPhoneTexts = getAllByText('iPhone 15 Pro Max')
      expect(iPhoneTexts.length).toBeGreaterThan(0)
      expect(getAllByText('Apple Smartphone')).toBeTruthy()
    })
  })

  it('should maintain product list state after modal interactions', async () => {
    const { getByTestId, getByText } = renderWithProvider(<HomeScreen />)

    await waitFor(() => {
      expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
    })

    const detailButton = getByTestId('product-list-screen-product-0-detail-btn')
    fireEvent.press(detailButton)

    await waitFor(() => {
      expect(getByTestId('product-detail-modal')).toBeTruthy()
    })

    const closeButton = getByTestId('product-detail-modal-close-btn')
    fireEvent.press(closeButton)

    await waitFor(() => {
      expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
      expect(getByText('iPhone 15 Pro Max')).toBeTruthy()
    })
  })

  it('should render ProductList with responsive prop', async () => {
    const { getByTestId } = renderWithProvider(<HomeScreen />)

    await waitFor(() => {
      expect(getByTestId('product-list-screen')).toBeTruthy()
    })
  })

  it('should handle empty product list', async () => {
    (fetchProducts as jest.Mock).mockResolvedValue([])

    const { getByText } = renderWithProvider(<HomeScreen />)

    await waitFor(() => {
      expect(getByText('No se encontraron productos')).toBeTruthy()
    })
  })
})