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
  const mockOnAddToCart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe renderizar correctamente con todos los elementos', () => {
    const { getByText, getByTestId } = render(
      <ProductCard
        product={mockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
        testID="product-card"
      />,
    )

    expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
    expect(getByText(/Laptop de alto rendimiento/)).toBeTruthy()
    expect(getByText('15 disponibles')).toBeTruthy()
  })

  it('debe mostrar badge verde cuando hay más de 10 unidades', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} testID="product-card" />,
    )

    expect(getByText('15 disponibles')).toBeTruthy()
  })

  it('debe mostrar badge amarillo cuando hay pocas unidades', () => {
    const lowStockProduct = { ...mockProduct, quantity: 3 }
    const { getByText } = render(
      <ProductCard product={lowStockProduct} testID="product-card" />,
    )

    expect(getByText('Solo 3 disponibles')).toBeTruthy()
  })

  it('debe mostrar "Agotado" cuando no hay stock', () => {
    const outOfStockProduct = { ...mockProduct, quantity: 0 }
    const { getByText } = render(
      <ProductCard product={outOfStockProduct} testID="product-card" />,
    )

    expect(getByText('Agotado')).toBeTruthy()
  })

  it('debe deshabilitar botones cuando no hay stock', () => {
    const outOfStockProduct = { ...mockProduct, quantity: 0 }
    const { getByTestId } = render(
      <ProductCard
        product={outOfStockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
        testID="product-card"
      />,
    )

    const detailButton = getByTestId('product-card-detail-btn')
    const addButton = getByTestId('product-card-add-btn')

    fireEvent.press(detailButton)
    fireEvent.press(addButton)

    expect(mockOnPress).not.toHaveBeenCalled()
    expect(mockOnAddToCart).not.toHaveBeenCalled()
  })

  it('debe llamar onPress cuando se presiona "Ver detalle"', () => {
    const { getByTestId } = render(
      <ProductCard
        product={mockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
        testID="product-card"
      />,
    )

    const detailButton = getByTestId('product-card-detail-btn')
    fireEvent.press(detailButton)

    expect(mockOnPress).toHaveBeenCalledWith(mockProduct)
    expect(mockOnPress).toHaveBeenCalledTimes(1)
  })

  it('debe llamar onAddToCart cuando se presiona "Agregar"', () => {
    const { getByTestId } = render(
      <ProductCard
        product={mockProduct}
        onPress={mockOnPress}
        onAddToCart={mockOnAddToCart}
        testID="product-card"
      />,
    )

    const addButton = getByTestId('product-card-add-btn')
    fireEvent.press(addButton)

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct)
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1)
  })

  it('debe formatear el precio correctamente en COP', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} testID="product-card" />,
    )
    expect(getByText(/4\.500\.000/)).toBeTruthy()
  })

  it('debe renderizar en modo compact correctamente', () => {
    const { getByTestId } = render(
      <ProductCard
        product={mockProduct}
        compact
        testID="product-card"
      />,
    )

    expect(getByTestId('product-card')).toBeTruthy()
  })

  it('debe ocultar el badge de stock cuando showStock es false', () => {
    const { queryByText } = render(
      <ProductCard
        product={mockProduct}
        showStock={false}
        testID="product-card"
      />,
    )

    expect(queryByText('15 disponibles')).toBeNull()
  })
})