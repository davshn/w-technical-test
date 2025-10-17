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
  const mockOnAddToCart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('debe renderizar el título y SearchBar', () => {
    const { getByText, getByPlaceholderText } = render(
      <ProductList
        products={mockProducts}
        testID="product-list"
      />,
    )

    expect(getByText('Productos')).toBeTruthy()
    expect(getByPlaceholderText('Buscar productos electrónicos...')).toBeTruthy()
  })

  it('debe mostrar skeletons cuando está cargando', () => {
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

  it('debe mostrar lista de productos cuando no está cargando', () => {
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

  it('debe mostrar mensaje vacío cuando no hay productos', () => {
    const { getByText } = render(
      <ProductList
        products={[]}
        loading={false}
        emptyMessage="No hay productos disponibles"
        testID="product-list"
      />,
    )

    expect(getByText('No hay productos disponibles')).toBeTruthy()
  })

  it('debe filtrar productos localmente cuando se escribe en SearchBar', async () => {
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

  it('debe llamar onSearch cuando se busca con callback remoto', async () => {
    const { getByTestId } = render(
      <ProductList
        products={mockProducts}
        onSearch={mockOnSearch}
        testID="product-list"
      />,
    )

    const searchInput = getByTestId('product-list-search')
    fireEvent.changeText(searchInput, 'gaming')

    jest.advanceTimersByTime(500) // Debounce de 500ms

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('gaming')
    })
  })

  it('debe llamar onProductPress cuando se presiona "Ver detalle"', () => {
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

  it('debe llamar onAddToCart cuando se presiona "Agregar"', () => {
    const { getByTestId } = render(
      <ProductList
        products={mockProducts}
        onAddToCart={mockOnAddToCart}
        testID="product-list"
      />,
    )

    const addButton = getByTestId('product-list-product-0-add-btn')
    fireEvent.press(addButton)

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProducts[0])
  })

  it('debe manejar pull-to-refresh correctamente', async () => {
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

  it('debe mostrar mensaje de búsqueda vacía cuando no hay resultados', async () => {
    const { getByTestId, getByText } = render(
      <ProductList
        products={mockProducts}
        testID="product-list"
      />,
    )

    const searchInput = getByTestId('product-list-search')
    fireEvent.changeText(searchInput, 'producto inexistente')

    await waitFor(() => {
      expect(getByText('No se encontraron productos')).toBeTruthy()
      expect(getByText('Intenta con otros términos de búsqueda')).toBeTruthy()
    })
  })

  it('debe mostrar placeholder personalizado en SearchBar', () => {
    const { getByPlaceholderText } = render(
      <ProductList
        products={mockProducts}
        searchPlaceholder="Buscar en el catálogo..."
        testID="product-list"
      />,
    )

    expect(getByPlaceholderText('Buscar en el catálogo...')).toBeTruthy()
  })

  it('debe renderizar todos los productos correctamente', () => {
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
})