import { render, fireEvent } from '@testing-library/react-native'
import type { Product } from './ProductCardProps'
import { ProductCard } from './index'

describe('ProductCard - Integration Tests', () => {
  const mockProduct: Product = {
    id: 1,
    name: 'Laptop Gaming ASUS ROG',
    uri: 'https://example.com/image.jpg',
    description: 'Laptop de alto rendimiento con procesador Intel i9',
    quantity: 15,
    value: 4500000,
  }

  const mockOnPress = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render correctly with all elements', () => {
    const { getByText, getByTestId } = render(
      <ProductCard
        product={mockProduct}
        onPress={mockOnPress}
        testID="product-card"
      />,
    )

    expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
    expect(getByText('15 disp.')).toBeTruthy()
    expect(getByTestId('product-card-image')).toBeTruthy()
    expect(getByTestId('product-card-price')).toBeTruthy()
    expect(getByText('Ver detalle')).toBeTruthy()
  })

  it('should show green badge when stock is more than 10 units', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} testID="product-card" />,
    )

    expect(getByText('15 disp.')).toBeTruthy()
  })

  it('should show yellow badge when stock is low', () => {
    const lowStockProduct = { ...mockProduct, quantity: 3 }
    const { getByText } = render(
      <ProductCard product={lowStockProduct} testID="product-card" />,
    )

    expect(getByText('Solo 3')).toBeTruthy()
  })

  it('should show "Agotado" when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, quantity: 0 }
    const { getByText } = render(
      <ProductCard product={outOfStockProduct} testID="product-card" />,
    )

    expect(getByText('Agotado')).toBeTruthy()
  })

  it('should call onPress when pressing "Ver detalle" button', () => {
    const { getByTestId } = render(
      <ProductCard
        product={mockProduct}
        onPress={mockOnPress}
        testID="product-card"
      />,
    )

    const detailButton = getByTestId('product-card-detail-btn')
    fireEvent.press(detailButton)

    expect(mockOnPress).toHaveBeenCalledWith(mockProduct)
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('should format price correctly in COP', () => {
    const { getByTestId } = render(
      <ProductCard product={mockProduct} testID="product-card" />,
    )

    const priceElement = getByTestId('product-card-price')
    const priceText = Array.isArray(priceElement.props.children)
      ? priceElement.props.children.join('')
      : priceElement.props.children

    expect(priceText).toContain('4.500.000')
  })

  it('should render in compact mode correctly', () => {
    const { getByTestId } = render(
      <ProductCard
        product={mockProduct}
        compact
        testID="product-card"
      />,
    )

    expect(getByTestId('product-card')).toBeTruthy()
  })

  it('should hide stock badge when showStock is false', () => {
    const { queryByText } = render(
      <ProductCard
        product={mockProduct}
        showStock={false}
        testID="product-card"
      />,
    )

    expect(queryByText('15 disp.')).toBeNull()
  })

  it('should render image with correct aspect ratio', () => {
    const { getByTestId } = render(
      <ProductCard
        product={mockProduct}
        imageAspectRatio="16:9"
        testID="product-card"
      />,
    )

    expect(getByTestId('product-card-image')).toBeTruthy()
  })

  it('should display product name limited to 2 lines', () => {
    const longNameProduct = {
      ...mockProduct,
      name: 'This is a very long product name that should be truncated to two lines maximum',
    }
    const { getByTestId } = render(
      <ProductCard product={longNameProduct} testID="product-card" />,
    )

    expect(getByTestId('product-card-name')).toBeTruthy()
  })

  it('should render with responsive enabled', () => {
    const { getByTestId } = render(
      <ProductCard
        product={mockProduct}
        responsive={true}
        testID="product-card"
      />,
    )

    expect(getByTestId('product-card')).toBeTruthy()
  })

  it('should handle products with large prices correctly', () => {
    const expensiveProduct = { ...mockProduct, value: 999999999 }
    const { getByTestId } = render(
      <ProductCard product={expensiveProduct} testID="product-card" />,
    )

    const priceElement = getByTestId('product-card-price')
    const priceText = Array.isArray(priceElement.props.children)
      ? priceElement.props.children.join('')
      : priceElement.props.children

    expect(priceText).toContain('999.999.999')
  })

  it('should show correct stock label for 5 units', () => {
    const fiveUnitsProduct = { ...mockProduct, quantity: 5 }
    const { getByText } = render(
      <ProductCard product={fiveUnitsProduct} testID="product-card" />,
    )

    expect(getByText('Solo 5')).toBeTruthy()
  })

  it('should show correct stock label for 11 units', () => {
    const elevenUnitsProduct = { ...mockProduct, quantity: 11 }
    const { getByText } = render(
      <ProductCard product={elevenUnitsProduct} testID="product-card" />,
    )

    expect(getByText('11 disp.')).toBeTruthy()
  })

  it('should render detail button enabled by default', () => {
    const { getByTestId } = render(
      <ProductCard
        product={mockProduct}
        onPress={mockOnPress}
        testID="product-card"
      />,
    )

    const detailButton = getByTestId('product-card-detail-btn')
    fireEvent.press(detailButton)

    expect(mockOnPress).toHaveBeenCalled()
  })
})