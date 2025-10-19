import { render, fireEvent } from '@testing-library/react-native'
import { CartItem } from './index'
import type { CartItem as CartItemType } from './CartItemProps'

describe('CartItem - Integration Tests', () => {
  const mockItem: CartItemType = {
    id: 1,
    name: 'Laptop Gaming ASUS ROG',
    uri: 'https://example.com/laptop.jpg',
    description: 'High performance gaming laptop',
    quantity: 2,
    value: 4500000,
  }

  const mockOnQuantityChange = jest.fn()
  const mockOnRemove = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render item correctly', () => {
    const { getByText, getByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        testID="cart-item"
      />
    )

    expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
    expect(getByTestId('cart-item-image')).toBeTruthy()
    expect(getByTestId('cart-item-stepper')).toBeTruthy()
  })

  it('should display formatted price', () => {
    const { getByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        testID="cart-item"
      />
    )

    const priceText = getByTestId('cart-item-price')
    expect(priceText.props.children).toContain('4.500.000')
  })

  it('should calculate and display correct subtotal', () => {
    const { getByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        testID="cart-item"
      />
    )

    const subtotalText = getByTestId('cart-item-subtotal')
    expect(subtotalText.props.children).toContain('9.000.000')
  })

  it('should call onRemove when remove button is pressed', () => {
    const { getByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        onRemove={mockOnRemove}
        testID="cart-item"
      />
    )

    const removeButton = getByTestId('cart-item-remove-btn')
    fireEvent.press(removeButton)

    expect(mockOnRemove).toHaveBeenCalledWith(1)
  })

  it('should call onQuantityChange when stepper is incremented', () => {
    const { getByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        onQuantityChange={mockOnQuantityChange}
        testID="cart-item"
      />
    )

    const incrementButton = getByTestId('cart-item-stepper-increment')
    fireEvent.press(incrementButton)

    expect(mockOnQuantityChange).toHaveBeenCalledWith(1, 3)
  })

  it('should call onQuantityChange when stepper is decremented', () => {
    const { getByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        onQuantityChange={mockOnQuantityChange}
        testID="cart-item"
      />
    )

    const decrementButton = getByTestId('cart-item-stepper-decrement')
    fireEvent.press(decrementButton)

    expect(mockOnQuantityChange).toHaveBeenCalledWith(1, 1)
  })

  it('should not allow quantity below 1', () => {
    const itemWithMinQuantity = { ...mockItem, quantity: 1 }
    const { getByTestId } = render(
      <CartItem
        item={itemWithMinQuantity}
        availableStock={10}
        onQuantityChange={mockOnQuantityChange}
        testID="cart-item"
      />
    )

    const decrementButton = getByTestId('cart-item-stepper-decrement')
    expect(decrementButton.props.accessibilityState.disabled).toBe(true)
  })

  it('should not allow quantity above available stock', () => {
    const itemWithMaxQuantity = { ...mockItem, quantity: 10 }
    const { getByTestId } = render(
      <CartItem
        item={itemWithMaxQuantity}
        availableStock={10}
        onQuantityChange={mockOnQuantityChange}
        testID="cart-item"
      />
    )

    const incrementButton = getByTestId('cart-item-stepper-increment')
    expect(incrementButton.props.accessibilityState.disabled).toBe(true)
  })

  it('should not show stock warning when available stock is high', () => {
    const { queryByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        testID="cart-item"
      />
    )

    expect(queryByTestId('cart-item-stock-warning')).toBeNull()
  })

  it('should hide image when showImage is false', () => {
    const { queryByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        showImage={false}
        testID="cart-item"
      />
    )

    expect(queryByTestId('cart-item-image')).toBeNull()
  })

  it('should display image when showImage is true', () => {
    const { getByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        showImage={true}
        testID="cart-item"
      />
    )

    expect(getByTestId('cart-item-image')).toBeTruthy()
  })

  it('should handle item with long name', () => {
    const longNameItem = {
      ...mockItem,
      name: 'This is a very long product name that should be truncated after two lines',
    }
    const { getByText } = render(
      <CartItem
        item={longNameItem}
        availableStock={10}
        testID="cart-item"
      />
    )

    expect(getByText(longNameItem.name)).toBeTruthy()
  })

  it('should update subtotal when quantity changes', () => {
    const { getByTestId, rerender } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        onQuantityChange={mockOnQuantityChange}
        testID="cart-item"
      />
    )

    const incrementButton = getByTestId('cart-item-stepper-increment')
    fireEvent.press(incrementButton)

    const updatedItem = { ...mockItem, quantity: 3 }
    rerender(
      <CartItem
        item={updatedItem}
        availableStock={10}
        onQuantityChange={mockOnQuantityChange}
        testID="cart-item"
      />
    )

    const subtotalText = getByTestId('cart-item-subtotal')
    expect(subtotalText.props.children).toContain('13.500.000')
  })

  it('should render with responsive prop', () => {
    const { getByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        responsive={true}
        testID="cart-item"
      />
    )

    expect(getByTestId('cart-item')).toBeTruthy()
  })

  it('should handle zero available stock gracefully', () => {
    const { getByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={0}
        testID="cart-item"
      />
    )

    expect(getByTestId('cart-item-stock-warning')).toBeTruthy()
  })

  it('should format large prices correctly', () => {
    const expensiveItem = { ...mockItem, value: 15000000 }
    const { getByTestId } = render(
      <CartItem
        item={expensiveItem}
        availableStock={10}
        testID="cart-item"
      />
    )

    const priceText = getByTestId('cart-item-price')
    expect(priceText.props.children).toContain('15.000.000')
  })

  it('should display stepper with current cart quantity', () => {
    const { getByTestId } = render(
      <CartItem
        item={mockItem}
        availableStock={10}
        testID="cart-item"
      />
    )

    const stepperValue = getByTestId('cart-item-stepper-value')
    expect(stepperValue.props.children).toBe('2')
  })

  it('should respect available stock even if cart quantity is lower', () => {
    const itemInCart = { ...mockItem, quantity: 2 }
    const { getByTestId } = render(
      <CartItem
        item={itemInCart}
        availableStock={2}
        onQuantityChange={mockOnQuantityChange}
        testID="cart-item"
      />
    )

    const incrementButton = getByTestId('cart-item-stepper-increment')
    expect(incrementButton.props.accessibilityState.disabled).toBe(true)
  })
})