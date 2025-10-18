import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { ProductList } from './index'
import type { Product } from '../../molecule/ProductCardMol/ProductCardProps'

describe('ProductList - Integration Tests', () => {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Laptop Gaming ASUS ROG',
      uri: 'https://example.com/1.jpg',
      description: 'Laptop de alto rendimiento',
      quantity: 15,
      value: 4500000,
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max',
      uri: 'https://example.com/2.jpg',
      description: 'Smartphone Apple',
      quantity: 8,
      value: 5200000,
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24',
      uri: 'https://example.com/3.jpg',
      description: 'Teléfono premium',
      quantity: 0,
      value: 4800000,
    },
  ]

  const mockOnSearch = jest.fn()
  const mockOnRefresh = jest.fn()
  const mockOnProductPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render title and SearchBar', () => {
    const { getByText, getByPlaceholderText } = render(
      <ProductList
        products={mockProducts}
        testID="product-list"
      />,
    )

    expect(getByText('Productos Electrónicos')).toBeTruthy()
    expect(getByPlaceholderText('Buscar productos electrónicos...')).toBeTruthy()
  })

  it('should show skeletons when loading', () => {
    const { getByTestId, queryByTestId } = render(
      <ProductList
        products={[]}
        loading
        skeletonCount={3}
        testID="product-list"
      />,
    )

    expect(getByTestId('product-list-skeleton-0')).toBeTruthy()
    expect(getByTestId('product-list-skeleton-1')).toBeTruthy()
    expect(getByTestId('product-list-skeleton-2')).toBeTruthy()
    expect(queryByTestId('product-list-list')).toBeNull()
  })

  it('should show product list when not loading', () => {
    const { getByText, getByTestId } = render(
      <ProductList
        products={mockProducts}
        loading={false}
        testID="product-list"
      />,
    )

    expect(getByTestId('product-list-list')).toBeTruthy()
    expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
    expect(getByText('iPhone 15 Pro Max')).toBeTruthy()
    expect(getByText('Samsung Galaxy S24')).toBeTruthy()
  })

  it('should show empty message when no products', () => {
    const { getByText } = render(
      <ProductList
        products={[]}
        loading={false}
        emptyMessage="No products available"
        testID="product-list"
      />,
    )

    expect(getByText('No products available')).toBeTruthy()
  })

  it('should filter products locally when typing in SearchBar', async () => {
    const { getByTestId, getByText, queryByText } = render(
      <ProductList
        products={mockProducts}
        testID="product-list"
      />,
    )

    const searchInput = getByTestId('product-list-search')
    fireEvent.changeText(searchInput, 'laptop')

    await waitFor(() => {
      expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
      expect(queryByText('iPhone 15 Pro Max')).toBeNull()
      expect(queryByText('Samsung Galaxy S24')).toBeNull()
    })
  })

  it('should call onSearch when searching with remote callback', async () => {
    const { getByTestId } = render(
      <ProductList
        products={mockProducts}
        onSearch={mockOnSearch}
        testID="product-list"
      />,
    )

    const searchInput = getByTestId('product-list-search')
    fireEvent.changeText(searchInput, 'gaming')

    jest.advanceTimersByTime(500)

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('gaming')
    })
  })

  it('should call onProductPress when pressing "Ver detalle"', () => {
    const { getByTestId } = render(
      <ProductList
        products={mockProducts}
        onProductPress={mockOnProductPress}
        testID="product-list"
      />,
    )

    const detailButton = getByTestId('product-list-product-0-detail-btn')
    fireEvent.press(detailButton)

    expect(mockOnProductPress).toHaveBeenCalledWith(mockProducts[0])
  })

  it('should handle pull-to-refresh correctly', async () => {
    const { getByTestId } = render(
      <ProductList
        products={mockProducts}
        onRefresh={mockOnRefresh}
        testID="product-list"
      />,
    )

    const list = getByTestId('product-list-list')
    fireEvent(list, 'refresh')

    await waitFor(() => {
      expect(mockOnRefresh).toHaveBeenCalled()
    })
  })

  it('should show empty search message when no results', async () => {
    const { getByTestId, getByText } = render(
      <ProductList
        products={mockProducts}
        testID="product-list"
      />,
    )

    const searchInput = getByTestId('product-list-search')
    fireEvent.changeText(searchInput, 'nonexistent product')

    await waitFor(() => {
      expect(getByText('No se encontraron productos')).toBeTruthy()
      expect(getByText('Intenta con otros términos de búsqueda')).toBeTruthy()
    })
  })

  it('should show custom placeholder in SearchBar', () => {
    const { getByPlaceholderText } = render(
      <ProductList
        products={mockProducts}
        searchPlaceholder="Search in catalog..."
        testID="product-list"
      />,
    )

    expect(getByPlaceholderText('Search in catalog...')).toBeTruthy()
  })

  it('should render all products correctly', () => {
    const { getByTestId } = render(
      <ProductList
        products={mockProducts}
        testID="product-list"
      />,
    )

    expect(getByTestId('product-list-product-0')).toBeTruthy()
    expect(getByTestId('product-list-product-1')).toBeTruthy()
    expect(getByTestId('product-list-product-2')).toBeTruthy()
  })

  it('should render with custom skeleton count', () => {
    const { getByTestId, queryByTestId } = render(
      <ProductList
        products={[]}
        loading
        skeletonCount={5}
        testID="product-list"
      />,
    )

    expect(getByTestId('product-list-skeleton-0')).toBeTruthy()
    expect(getByTestId('product-list-skeleton-4')).toBeTruthy()
    expect(queryByTestId('product-list-skeleton-5')).toBeNull()
  })

  it('should clear search when clear button is pressed', () => {
    const { getByTestId, queryByText } = render(
      <ProductList
        products={mockProducts}
        testID="product-list"
      />,
    )

    const searchInput = getByTestId('product-list-search')
    fireEvent.changeText(searchInput, 'laptop')

    const clearButton = getByTestId('product-list-search-right-icon-button')
    fireEvent.press(clearButton)

    expect(queryByText('iPhone 15 Pro Max')).toBeTruthy()
    expect(queryByText('Samsung Galaxy S24')).toBeTruthy()
  })

  it('should show loading state in search when searching', async () => {
    const { getByTestId } = render(
      <ProductList
        products={mockProducts}
        onSearch={mockOnSearch}
        testID="product-list"
      />,
    )

    const searchInput = getByTestId('product-list-search')
    fireEvent.changeText(searchInput, 'test')

    jest.advanceTimersByTime(500)

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalled()
    })
  })

  it('should render with responsive enabled', () => {
    const { getByTestId } = render(
      <ProductList
        products={mockProducts}
        responsive
        testID="product-list"
      />,
    )

    expect(getByTestId('product-list')).toBeTruthy()
  })

  it('should filter products by description', async () => {
    const { getByTestId, getByText, queryByText } = render(
      <ProductList
        products={mockProducts}
        testID="product-list"
      />,
    )

    const searchInput = getByTestId('product-list-search')
    fireEvent.changeText(searchInput, 'alto rendimiento')

    await waitFor(() => {
      expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
      expect(queryByText('iPhone 15 Pro Max')).toBeNull()
    })
  })

  it('should show all products when search is empty', async () => {
    const { getByTestId, getByText } = render(
      <ProductList
        products={mockProducts}
        testID="product-list"
      />,
    )

    const searchInput = getByTestId('product-list-search')
    fireEvent.changeText(searchInput, 'laptop')
    fireEvent.changeText(searchInput, '')

    await waitFor(() => {
      expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
      expect(getByText('iPhone 15 Pro Max')).toBeTruthy()
      expect(getByText('Samsung Galaxy S24')).toBeTruthy()
    })
  })

  it('should handle case-insensitive search', async () => {
    const { getByTestId, getByText } = render(
      <ProductList
        products={mockProducts}
        testID="product-list"
      />,
    )

    const searchInput = getByTestId('product-list-search')
    fireEvent.changeText(searchInput, 'LAPTOP')

    await waitFor(() => {
      expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
    })
  })

  it('should not show skeletons when loading is false', () => {
    const { queryByTestId } = render(
      <ProductList
        products={mockProducts}
        loading={false}
        testID="product-list"
      />,
    )

    expect(queryByTestId('product-list-skeleton-0')).toBeNull()
  })
})