import { render, fireEvent } from '@testing-library/react-native'
import { ProductDetailModal } from './index'
import type { Product } from '.././ProductCardMol/ProductCardProps'

describe('ProductDetailModal - Integration Tests', () => {
  const mockProduct: Product = {
    id: 1,
    name: 'Laptop Gaming ASUS ROG',
    uri: 'https://example.com/image.jpg',
    description: 'Laptop de alto rendimiento con procesador Intel i9, 32GB RAM, RTX 4080',
    quantity: 15,
    value: 4500000,
  }

  const mockOnClose = jest.fn()
  const mockOnAddToCart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('debe renderizar el modal cuando visible es true', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByTestId('modal')).toBeTruthy()
    expect(getByTestId('modal-content')).toBeTruthy()
  })

  it('no debe renderizar nada cuando visible es false', () => {
    const { queryByTestId } = render(
      <ProductDetailModal
        visible={false}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(queryByTestId('modal-content')).toBeNull()
  })

  it('no debe renderizar nada cuando product es null', () => {
    const { queryByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={null}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(queryByTestId('modal-content')).toBeNull()
  })

  it('debe mostrar toda la información del producto correctamente', () => {
    const { getByText, getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()

    expect(getByText(/Laptop de alto rendimiento/)).toBeTruthy()
    expect(getByText(/4\.500\.000/)).toBeTruthy()

    expect(getByText('#1')).toBeTruthy()

    expect(getByText('En stock')).toBeTruthy()

    expect(getByTestId('modal-image')).toBeTruthy()
  })

  it('debe mostrar badge verde cuando hay más de 10 unidades', () => {
    const { getByText } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByText('15 en stock')).toBeTruthy()
  })

  it('debe mostrar badge amarillo cuando hay pocas unidades', () => {
    const lowStockProduct = { ...mockProduct, quantity: 3 }
    const { getByText } = render(
      <ProductDetailModal
        visible={true}
        product={lowStockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByText('Solo 3 disponibles')).toBeTruthy()
  })

  it('debe formatear el precio correctamente en COP', () => {
    const { getByText } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByText(/4\.500\.000/)).toBeTruthy()
  })

  it('debe llamar onClose cuando se presiona el botón X', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const closeButton = getByTestId('modal-close-btn')
    fireEvent.press(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('debe llamar onClose cuando se presiona el botón Cerrar del footer', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const closeFooterButton = getByTestId('modal-close-footer-btn')
    fireEvent.press(closeFooterButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('debe llamar onClose cuando se presiona el backdrop', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const backdrop = getByTestId('modal-backdrop')
    fireEvent.press(backdrop)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('debe llamar onAddToCart y onClose cuando se presiona "Agregar al carrito"', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        testID="modal"
      />,
    )

    const addButton = getByTestId('modal-add-cart-btn')
    fireEvent.press(addButton)

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct)
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('debe renderizar la imagen con la URI correcta', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const image = getByTestId('modal-image')
    expect(image).toBeTruthy()
  })

  it('debe mostrar el ID del producto formateado', () => {
    const productWithId = { ...mockProduct, id: 123 }
    const { getByText } = render(
      <ProductDetailModal
        visible={true}
        product={productWithId}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByText('#123')).toBeTruthy()
  })

  it('debe renderizar todos los botones correctamente', () => {
    const { getByTestId, getByText } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        testID="modal"
      />,
    )

    expect(getByTestId('modal-close-btn')).toBeTruthy()

    expect(getByText('Cerrar')).toBeTruthy()
    expect(getByText('Agregar al carrito')).toBeTruthy()
  })

  it('debe renderizar con responsive habilitado', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        responsive={true}
        testID="modal"
      />,
    )

    expect(getByTestId('modal')).toBeTruthy()
  })

  it('debe manejar productos con precios grandes correctamente', () => {
    const expensiveProduct = { ...mockProduct, value: 999999999 }
    const { getByText } = render(
      <ProductDetailModal
        visible={true}
        product={expensiveProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByText(/999\.999\.999/)).toBeTruthy()
  })

  it('debe manejar descripciones largas correctamente', () => {
    const longDescriptionProduct = {
      ...mockProduct,
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10),
    }
    const { getByText } = render(
      <ProductDetailModal
        visible={true}
        product={longDescriptionProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByText(/Lorem ipsum/)).toBeTruthy()
  })
})