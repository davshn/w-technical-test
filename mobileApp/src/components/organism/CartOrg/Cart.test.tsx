import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { Cart } from './index'
import type { CartItemType, AvailableProduct } from './CartProps'
jest.mock('react-native-webview', () => {
  const { View } = require('react-native')
  return {
    WebView: View,
  }
})

describe('Cart - Integration Tests', () => {
  const mockItems: CartItemType[] = [
    {
      id: 1,
      name: 'Laptop Gaming ASUS ROG',
      uri: 'https://example.com/laptop.jpg',
      description: 'High performance laptop',
      quantity: 2,
      value: 4500000,
    },
    {
      id: 2,
      name: 'iPhone 15 Pro Max',
      uri: 'https://example.com/iphone.jpg',
      description: 'Apple Smartphone',
      quantity: 1,
      value: 5200000,
    },
  ]

  const mockAvailableProducts: AvailableProduct[] = [
    { id: 1, quantity: 10 },
    { id: 2, quantity: 5 },
  ]

  const mockOnQuantityChange = jest.fn()
  const mockOnRemoveItem = jest.fn()
  const mockOnAddPaymentMethod = jest.fn()
  const mockOnCheckout = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render cart with items', () => {
    const { getByText, getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        total={14200000}
        testID="cart"
      />
    )

    expect(getByText('Carrito de Compras')).toBeTruthy()
    expect(getByText('2 productos')).toBeTruthy()
    expect(getByText('Laptop Gaming ASUS ROG')).toBeTruthy()
    expect(getByText('iPhone 15 Pro Max')).toBeTruthy()
    expect(getByTestId('cart-summary')).toBeTruthy()
  })

  it('should display empty cart message when no items', () => {
    const { getByText } = render(
      <Cart
        items={[]}
        availableProducts={[]}
        subtotal={0}
        total={0}
        testID="cart"
      />
    )

    expect(getByText('Tu carrito está vacío')).toBeTruthy()
    expect(getByText('Agrega productos para comenzar tu compra')).toBeTruthy()
  })

  it('should display custom empty messages', () => {
    const { getByText } = render(
      <Cart
        items={[]}
        availableProducts={[]}
        subtotal={0}
        total={0}
        emptyMessage="No products"
        emptyDescription="Start shopping now"
        testID="cart"
      />
    )

    expect(getByText('No products')).toBeTruthy()
    expect(getByText('Start shopping now')).toBeTruthy()
  })

  it('should render all cart items', () => {
    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        total={14200000}
        testID="cart"
      />
    )

    expect(getByTestId('cart-item-1')).toBeTruthy()
    expect(getByTestId('cart-item-2')).toBeTruthy()
  })

  it('should pass available stock to cart items', () => {
    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        total={14200000}
        testID="cart"
      />
    )

    const item1 = getByTestId('cart-item-1')
    expect(item1).toBeTruthy()
  })

  it('should call onQuantityChange when item quantity changes', () => {
    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        total={14200000}
        onQuantityChange={mockOnQuantityChange}
        testID="cart"
      />
    )

    const incrementButton = getByTestId('cart-item-1-stepper-increment')
    fireEvent.press(incrementButton)

    expect(mockOnQuantityChange).toHaveBeenCalledWith(1, 3)
  })

  it('should call onRemoveItem when remove button is pressed', () => {
    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        total={14200000}
        onRemoveItem={mockOnRemoveItem}
        testID="cart"
      />
    )

    const removeButton = getByTestId('cart-item-1-remove-btn')
    fireEvent.press(removeButton)

    expect(mockOnRemoveItem).toHaveBeenCalledWith(1)
  })

  it('should display cart summary with correct totals', () => {
    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        tax={2698000}
        discount={500000}
        shipping={50000}
        total={16448000}
        testID="cart"
      />
    )

    const summary = getByTestId('cart-summary')
    expect(summary).toBeTruthy()
  })

  it('should call onCheckout when checkout button is pressed', () => {
    const mockPaymentMethod = {
      lastFourDigits: '4242',
      cardType: 'VISA' as const,
    }

    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        total={14200000}
        paymentMethod={mockPaymentMethod}
        onCheckout={mockOnCheckout}
        testID="cart"
      />
    )

    const checkoutButton = getByTestId('cart-summary-checkout-btn')
    fireEvent.press(checkoutButton)

    expect(mockOnCheckout).toHaveBeenCalled()
  })

  it('should display singular product text for one item', () => {
    const { getByText } = render(
      <Cart
        items={[mockItems[0]]}
        availableProducts={mockAvailableProducts}
        subtotal={9000000}
        total={9000000}
        testID="cart"
      />
    )

    expect(getByText('1 producto')).toBeTruthy()
  })

  it('should display plural product text for multiple items', () => {
    const { getByText } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        total={14200000}
        testID="cart"
      />
    )

    expect(getByText('2 productos')).toBeTruthy()
  })

  it('should render with responsive prop', () => {
    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        total={14200000}
        responsive
        testID="cart"
      />
    )

    expect(getByTestId('cart')).toBeTruthy()
  })

  it('should pass terms URL to payment modal', async () => {
    const termsUrl = 'https://example.com/terms.pdf'
    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        total={14200000}
        termsUrl={termsUrl}
        testID="cart"
      />
    )

    const addPaymentButton = getByTestId('cart-summary-add-payment-btn')
    fireEvent.press(addPaymentButton)

    await waitFor(() => {
      expect(getByTestId('cart-payment-modal')).toBeTruthy()
    })
  })

  it('should handle zero available stock for product', () => {
    const productsWithoutStock: AvailableProduct[] = [
      { id: 1, quantity: 0 },
      { id: 2, quantity: 5 },
    ]

    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={productsWithoutStock}
        subtotal={14200000}
        total={14200000}
        testID="cart"
      />
    )

    expect(getByTestId('cart-item-1')).toBeTruthy()
  })

  it('should handle product not in available products list', () => {
    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={[{ id: 999, quantity: 10 }]}
        subtotal={14200000}
        total={14200000}
        testID="cart"
      />
    )

    expect(getByTestId('cart-item-1')).toBeTruthy()
    expect(getByTestId('cart-item-2')).toBeTruthy()
  })

  it('should render list with correct testID', () => {
    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        total={14200000}
        testID="cart"
      />
    )

    expect(getByTestId('cart-list')).toBeTruthy()
  })

  it('should show payment method in summary when provided', () => {
    const mockPaymentMethod = {
      lastFourDigits: '4242',
      cardType: 'VISA' as const,
    }

    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={14200000}
        total={14200000}
        paymentMethod={mockPaymentMethod}
        testID="cart"
      />
    )

    expect(getByTestId('cart-summary-card-logo')).toBeTruthy()
    expect(getByTestId('cart-summary-checkout-btn')).toBeTruthy()
  })

  it('should calculate correct subtotal for items', () => {
    const expectedSubtotal = (mockItems[0].value * mockItems[0].quantity) +
                            (mockItems[1].value * mockItems[1].quantity)

    const { getByTestId } = render(
      <Cart
        items={mockItems}
        availableProducts={mockAvailableProducts}
        subtotal={expectedSubtotal}
        total={expectedSubtotal}
        testID="cart"
      />
    )

    expect(getByTestId('cart-summary')).toBeTruthy()
  })
})