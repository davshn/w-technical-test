import { render, fireEvent } from '@testing-library/react-native'
import { CartSummary } from './index'

describe('CartSummary - Integration Tests', () => {
  const defaultProps = {
    subtotal: 10000000,
    total: 10000000,
    itemCount: 3,
  }

  const mockOnAddPaymentMethod = jest.fn()
  const mockOnCheckout = jest.fn()

  const mockPaymentMethod = {
    cardLogo: { uri: 'https://example.com/visa.png' },
    lastFourDigits: '4242',
    cardType: 'visa' as const,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render summary correctly', () => {
    const { getByText, getByTestId } = render(
      <CartSummary {...defaultProps} testID="cart-summary" />
    )

    expect(getByText('Resumen de pedido')).toBeTruthy()
    expect(getByTestId('cart-summary-subtotal')).toBeTruthy()
    expect(getByTestId('cart-summary-total')).toBeTruthy()
  })

  it('should display formatted subtotal', () => {
    const { getByTestId } = render(
      <CartSummary {...defaultProps} testID="cart-summary" />
    )

    const subtotal = getByTestId('cart-summary-subtotal')
    expect(subtotal.props.children).toContain('10.000.000')
  })

  it('should display formatted total', () => {
    const { getByTestId } = render(
      <CartSummary {...defaultProps} testID="cart-summary" />
    )

    const total = getByTestId('cart-summary-total')
    expect(total.props.children).toContain('10.000.000')
  })

  it('should display item count', () => {
    const { getByTestId } = render(
      <CartSummary {...defaultProps} testID="cart-summary" />
    )

    const itemCount = getByTestId('cart-summary-item-count')
    expect(itemCount.props.children).toEqual([3, ' ', 'items'])
  })

  it('should display singular item text for one item', () => {
    const { getByTestId } = render(
      <CartSummary
        {...defaultProps}
        itemCount={1}
        testID="cart-summary"
      />
    )

    const itemCount = getByTestId('cart-summary-item-count')
    expect(itemCount.props.children).toEqual([1, ' ', 'item'])
  })

  it('should hide item count when showItemCount is false', () => {
    const { queryByTestId } = render(
      <CartSummary
        {...defaultProps}
        showItemCount={false}
        testID="cart-summary"
      />
    )

    expect(queryByTestId('cart-summary-item-count')).toBeNull()
  })

  it('should display tax when provided', () => {
    const { getByTestId, getByText } = render(
      <CartSummary
        {...defaultProps}
        tax={1900000}
        testID="cart-summary"
      />
    )

    expect(getByText('Tax')).toBeTruthy()
    const tax = getByTestId('cart-summary-tax')
    expect(tax.props.children).toContain('1.900.000')
  })

  it('should not display tax when zero', () => {
    const { queryByText } = render(
      <CartSummary {...defaultProps} tax={0} testID="cart-summary" />
    )

    expect(queryByText('Tax')).toBeNull()
  })

  it('should display discount when provided', () => {
    const { getByTestId, getByText } = render(
      <CartSummary
        {...defaultProps}
        discount={500000}
        testID="cart-summary"
      />
    )

    expect(getByText('Discount')).toBeTruthy()
    const discount = getByTestId('cart-summary-discount')
    expect(discount.props.children).toContain('500.000')
  })

  it('should display discount as negative value', () => {
    const { getByTestId } = render(
      <CartSummary
        {...defaultProps}
        discount={500000}
        testID="cart-summary"
      />
    )

    const discount = getByTestId('cart-summary-discount')
    expect(discount.props.children).toContain('-')
  })

  it('should not display discount when zero', () => {
    const { queryByText } = render(
      <CartSummary {...defaultProps} discount={0} testID="cart-summary" />
    )

    expect(queryByText('Discount')).toBeNull()
  })

  it('should display shipping when provided', () => {
    const { getByTestId, getByText } = render(
      <CartSummary
        {...defaultProps}
        shipping={50000}
        testID="cart-summary"
      />
    )

    expect(getByText('Shipping')).toBeTruthy()
    const shipping = getByTestId('cart-summary-shipping')
    expect(shipping.props.children).toContain('50.000')
  })

  it('should not display shipping when zero', () => {
    const { queryByText } = render(
      <CartSummary {...defaultProps} shipping={0} testID="cart-summary" />
    )

    expect(queryByText('Shipping')).toBeNull()
  })

  it('should display all fields when provided', () => {
    const { getByText, getByTestId } = render(
      <CartSummary
        subtotal={10000000}
        tax={1900000}
        discount={500000}
        shipping={50000}
        total={11450000}
        itemCount={5}
        testID="cart-summary"
      />
    )

    expect(getByText('Subtotal')).toBeTruthy()
    expect(getByText('Tax')).toBeTruthy()
    expect(getByText('Discount')).toBeTruthy()
    expect(getByText('Shipping')).toBeTruthy()
    expect(getByText('Total')).toBeTruthy()

    const total = getByTestId('cart-summary-total')
    expect(total.props.children).toContain('11.450.000')
  })

  it('should calculate correct total with all fees', () => {
    const subtotal = 10000000
    const tax = 1900000
    const discount = 500000
    const shipping = 50000
    const expectedTotal = subtotal + tax - discount + shipping

    const { getByTestId } = render(
      <CartSummary
        subtotal={subtotal}
        tax={tax}
        discount={discount}
        shipping={shipping}
        total={expectedTotal}
        itemCount={3}
        testID="cart-summary"
      />
    )

    const total = getByTestId('cart-summary-total')
    expect(total.props.children).toContain('11.450.000')
  })

  it('should render with responsive prop', () => {
    const { getByTestId } = render(
      <CartSummary
        {...defaultProps}
        responsive={true}
        testID="cart-summary"
      />
    )

    expect(getByTestId('cart-summary')).toBeTruthy()
  })

  it('should handle zero item count', () => {
    const { getByTestId } = render(
      <CartSummary
        {...defaultProps}
        itemCount={0}
        testID="cart-summary"
      />
    )

    expect(getByTestId('cart-summary')).toBeTruthy()
  })

  it('should format large numbers correctly', () => {
    const { getByTestId } = render(
      <CartSummary
        subtotal={99999999}
        total={99999999}
        itemCount={10}
        testID="cart-summary"
      />
    )

    const subtotal = getByTestId('cart-summary-subtotal')
    expect(subtotal.props.children).toContain('99.999.999')
  })

  it('should display divider between items and total', () => {
    const { getByTestId } = render(
      <CartSummary {...defaultProps} testID="cart-summary" />
    )

    expect(getByTestId('cart-summary')).toBeTruthy()
  })

  it('should handle custom currency', () => {
    const { getByTestId } = render(
      <CartSummary
        {...defaultProps}
        currency="USD"
        testID="cart-summary"
      />
    )

    expect(getByTestId('cart-summary-total')).toBeTruthy()
  })

  it('should display multiple items with correct formatting', () => {
    const { getByTestId } = render(
      <CartSummary
        subtotal={5000000}
        tax={950000}
        discount={200000}
        shipping={30000}
        total={5780000}
        itemCount={8}
        testID="cart-summary"
      />
    )

    expect(getByTestId('cart-summary-subtotal').props.children).toContain('5.000.000')
    expect(getByTestId('cart-summary-tax').props.children).toContain('950.000')
    expect(getByTestId('cart-summary-discount').props.children).toContain('200.000')
    expect(getByTestId('cart-summary-shipping').props.children).toContain('30.000')
    expect(getByTestId('cart-summary-total').props.children).toContain('5.780.000')
  })

  it('should handle only subtotal and total', () => {
    const { getByTestId, queryByText } = render(
      <CartSummary
        subtotal={8000000}
        total={8000000}
        itemCount={2}
        testID="cart-summary"
      />
    )

    expect(getByTestId('cart-summary-subtotal')).toBeTruthy()
    expect(getByTestId('cart-summary-total')).toBeTruthy()
    expect(queryByText('Tax')).toBeNull()
    expect(queryByText('Discount')).toBeNull()
    expect(queryByText('Shipping')).toBeNull()
  })

  it('should show add payment button when no payment method', () => {
    const { getByTestId, getByText } = render(
      <CartSummary
        {...defaultProps}
        onAddPaymentMethod={mockOnAddPaymentMethod}
        testID="cart-summary"
      />
    )

    expect(getByText('Pagar con:')).toBeTruthy()
    expect(getByTestId('cart-summary-add-payment-btn')).toBeTruthy()
    expect(getByText('Agregar tarjeta de crédito')).toBeTruthy()
  })

  it('should call onAddPaymentMethod when add payment button is pressed', () => {
    const { getByTestId } = render(
      <CartSummary
        {...defaultProps}
        onAddPaymentMethod={mockOnAddPaymentMethod}
        testID="cart-summary"
      />
    )

    const addPaymentButton = getByTestId('cart-summary-add-payment-btn')
    fireEvent.press(addPaymentButton)

    expect(mockOnAddPaymentMethod).toHaveBeenCalledTimes(1)
  })

  it('should show card logo and checkout button when payment method exists', () => {
    const { getByTestId, queryByTestId } = render(
      <CartSummary
        {...defaultProps}
        paymentMethod={mockPaymentMethod}
        onCheckout={mockOnCheckout}
        testID="cart-summary"
      />
    )

    expect(getByTestId('cart-summary-card-logo')).toBeTruthy()
    expect(getByTestId('cart-summary-card-number')).toBeTruthy()
    expect(getByTestId('cart-summary-checkout-btn')).toBeTruthy()
    expect(queryByTestId('cart-summary-add-payment-btn')).toBeNull()
  })

  it('should display last four digits of card', () => {
    const { getByTestId } = render(
      <CartSummary
        {...defaultProps}
        paymentMethod={mockPaymentMethod}
        testID="cart-summary"
      />
    )

    const cardNumber = getByTestId('cart-summary-card-number')
    expect(cardNumber.props.children).toEqual(['•••• ', '4242'])
  })

  it('should call onCheckout when checkout button is pressed', () => {
    const { getByTestId } = render(
      <CartSummary
        {...defaultProps}
        paymentMethod={mockPaymentMethod}
        onCheckout={mockOnCheckout}
        testID="cart-summary"
      />
    )

    const checkoutButton = getByTestId('cart-summary-checkout-btn')
    fireEvent.press(checkoutButton)

    expect(mockOnCheckout).toHaveBeenCalledTimes(1)
  })

  it('should show mastercard logo when card type is mastercard', () => {
    const mastercardPayment = {
      ...mockPaymentMethod,
      cardType: 'mastercard' as const,
      cardLogo: { uri: 'https://example.com/mastercard.png' },
    }

    const { getByTestId } = render(
      <CartSummary
        {...defaultProps}
        paymentMethod={mastercardPayment}
        testID="cart-summary"
      />
    )

    expect(getByTestId('cart-summary-card-logo')).toBeTruthy()
  })

  it('should handle payment method with local image source', () => {
    const localImagePayment = {
      ...mockPaymentMethod,
      cardLogo: 123,
    }

    const { getByTestId } = render(
      <CartSummary
        {...defaultProps}
        paymentMethod={localImagePayment}
        testID="cart-summary"
      />
    )

    expect(getByTestId('cart-summary-card-logo')).toBeTruthy()
  })

  it('should render payment section with all summary fields', () => {
    const { getByText, getByTestId } = render(
      <CartSummary
        subtotal={10000000}
        tax={1900000}
        discount={500000}
        shipping={50000}
        total={11450000}
        itemCount={5}
        onAddPaymentMethod={mockOnAddPaymentMethod}
        testID="cart-summary"
      />
    )

    expect(getByText('Subtotal')).toBeTruthy()
    expect(getByText('Total')).toBeTruthy()
    expect(getByText('Pagar con:')).toBeTruthy()
    expect(getByTestId('cart-summary-add-payment-btn')).toBeTruthy()
  })

  it('should show checkout button with correct text', () => {
    const { getByText } = render(
      <CartSummary
        {...defaultProps}
        paymentMethod={mockPaymentMethod}
        onCheckout={mockOnCheckout}
        testID="cart-summary"
      />
    )

    expect(getByText('Realizar compra')).toBeTruthy()
  })
})