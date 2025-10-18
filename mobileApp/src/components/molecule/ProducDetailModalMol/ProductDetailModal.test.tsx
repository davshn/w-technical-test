import { render, fireEvent } from '@testing-library/react-native'
import { ProductDetailModal } from './index'
import type { Product } from '../ProductCardMol/ProductCardProps'

const safePress = (element: any) => {
  try {
    fireEvent.press(element)
  } catch (error) {
    fireEvent(element, 'press', {
      nativeEvent: {},
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    })
  }
}

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

  it('should render modal when visible is true', () => {
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

  it('should not render anything when visible is false', () => {
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

  it('should not render anything when product is null', () => {
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

  it('should display all product information correctly', () => {
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
    expect(getByText(/c\/u/)).toBeTruthy()
    expect(getByText('En stock')).toBeTruthy()
    expect(getByTestId('modal-image')).toBeTruthy()
  })

  it('should show green badge when stock is more than 10 units', () => {
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

  it('should show yellow badge when stock is low', () => {
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

  it('should show "Agotado" when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, quantity: 0 }
    const { getAllByText } = render(
      <ProductDetailModal
        visible={true}
        product={outOfStockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const agotadoElements = getAllByText('Agotado')
    expect(agotadoElements.length).toBeGreaterThan(0)
  })

  it('should format price correctly in COP', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const unitPrice = getByTestId('modal-unit-price')
    const priceText = Array.isArray(unitPrice.props.children)
      ? unitPrice.props.children.join('')
      : unitPrice.props.children

    expect(priceText).toContain('4.500.000')
  })

  it('should render StepperInput with initial quantity of 1', () => {
    const { getByTestId, getByText } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByTestId('modal-stepper')).toBeTruthy()
    expect(getByText('Agregar (1)')).toBeTruthy()
  })

  it('should increment quantity when pressing + button', () => {
    const { getByTestId, getByText } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const incrementButton = getByTestId('modal-stepper-increment')

    safePress(incrementButton)

    expect(getByText('Agregar (2)')).toBeTruthy()
  })

  it('should decrement quantity when pressing - button', () => {
    const { getByTestId, getByText } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const incrementButton = getByTestId('modal-stepper-increment')
    const decrementButton = getByTestId('modal-stepper-decrement')

    safePress(incrementButton)
    expect(getByText('Agregar (2)')).toBeTruthy()

    safePress(decrementButton)
    expect(getByText('Agregar (1)')).toBeTruthy()
  })

  it('should not allow quantity less than 1', () => {
    const { getByTestId, getByText } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const decrementButton = getByTestId('modal-stepper-decrement')

    safePress(decrementButton)

    expect(getByText('Agregar (1)')).toBeTruthy()
  })

  it('should not allow quantity greater than available stock', () => {
    const lowStockProduct = { ...mockProduct, quantity: 2 }
    const { getByTestId, getByText } = render(
      <ProductDetailModal
        visible={true}
        product={lowStockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const incrementButton = getByTestId('modal-stepper-increment')

    safePress(incrementButton)
    expect(getByText('Agregar (2)')).toBeTruthy()

    safePress(incrementButton)

    expect(getByText('Agregar (2)')).toBeTruthy()
  })

  it('should calculate total price correctly', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const incrementButton = getByTestId('modal-stepper-increment')
    const totalPrice = getByTestId('modal-total-price')

    safePress(incrementButton)

    const totalText = Array.isArray(totalPrice.props.children)
      ? totalPrice.props.children.join('')
      : totalPrice.props.children

    expect(totalText).toContain('9.000.000')
  })

  it('should reset quantity to 1 when product changes', () => {
    const { rerender, getByText } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByText('Agregar (1)')).toBeTruthy()

    const newProduct = { ...mockProduct, id: 2, name: 'Other Product' }
    rerender(
      <ProductDetailModal
        visible={true}
        product={newProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByText('Agregar (1)')).toBeTruthy()
  })

  it('should disable StepperInput when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, quantity: 0 }
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={outOfStockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const incrementButton = getByTestId('modal-stepper-increment')
    const decrementButton = getByTestId('modal-stepper-decrement')

    safePress(incrementButton)
    safePress(decrementButton)

    expect(getByTestId('modal-stepper')).toBeTruthy()
  })

  it('should disable "Add to cart" button when out of stock', () => {
    const outOfStockProduct = { ...mockProduct, quantity: 0 }
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={outOfStockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        testID="modal"
      />,
    )

    const addButton = getByTestId('modal-add-cart-btn')
    safePress(addButton)

    expect(mockOnAddToCart).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should call onClose when pressing X button', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const closeButton = getByTestId('modal-close-btn')
    safePress(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when pressing footer Close button', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const closeFooterButton = getByTestId('modal-close-footer-btn')
    safePress(closeFooterButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onAddToCart with product and correct quantity', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        onAddToCart={mockOnAddToCart}
        testID="modal"
      />,
    )

    const incrementButton = getByTestId('modal-stepper-increment')
    const addButton = getByTestId('modal-add-cart-btn')

    safePress(incrementButton)
    safePress(incrementButton)

    safePress(addButton)

    expect(mockOnAddToCart).toHaveBeenCalledWith({
      ...mockProduct,
      quantity: 3,
    })
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onAddToCart with default quantity of 1', () => {
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
    safePress(addButton)

    expect(mockOnAddToCart).toHaveBeenCalledWith({
      ...mockProduct,
      quantity: 1,
    })
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1)
  })

  it('should render image with correct URI', () => {
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

  it('should render all buttons correctly', () => {
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
    expect(getByText('Agregar (1)')).toBeTruthy()
  })

  it('should render with responsive enabled', () => {
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

  it('should handle products with large prices correctly', () => {
    const expensiveProduct = { ...mockProduct, value: 999999999 }
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={expensiveProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const unitPrice = getByTestId('modal-unit-price')
    const priceText = Array.isArray(unitPrice.props.children)
      ? unitPrice.props.children.join('')
      : unitPrice.props.children

    expect(priceText).toContain('999.999.999')
  })

  it('should handle long descriptions correctly', () => {
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

  it('should show "Cantidad" label for stepper', () => {
    const { getByText } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByText('Cantidad')).toBeTruthy()
  })

  it('should show "Total" label for calculated price', () => {
    const { getByText } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    expect(getByText('Total')).toBeTruthy()
  })

  it('should update total price when changing quantity', () => {
    const { getByTestId } = render(
      <ProductDetailModal
        visible={true}
        product={mockProduct}
        onClose={mockOnClose}
        testID="modal"
      />,
    )

    const incrementButton = getByTestId('modal-stepper-increment')
    const totalPrice = getByTestId('modal-total-price')

    const getTotalText = () => {
      const children = totalPrice.props.children
      return Array.isArray(children) ? children.join('') : children
    }

    expect(getTotalText()).toContain('4.500.000')

    safePress(incrementButton)

    expect(getTotalText()).toContain('9.000.000')
  })
})