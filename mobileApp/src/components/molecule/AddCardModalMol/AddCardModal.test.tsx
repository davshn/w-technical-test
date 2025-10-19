import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { AddCardModal } from './index'

jest.mock('react-native-webview', () => {
  const { View } = require('react-native')
  return {
    WebView: View,
  }
})

describe('AddCardModal - Integration Tests', () => {
  const mockOnClose = jest.fn()
  const mockOnAddCard = jest.fn(() => Promise.resolve())

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render modal when visible', () => {
    const { getByText, getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    expect(getByText('Agregar Tarjeta de Crédito')).toBeTruthy()
    expect(getByTestId('add-card-modal-number-input')).toBeTruthy()
    expect(getByTestId('add-card-modal-holder-input')).toBeTruthy()
    expect(getByTestId('add-card-modal-email-input')).toBeTruthy()
    expect(getByTestId('add-card-modal-month-input')).toBeTruthy()
    expect(getByTestId('add-card-modal-year-input')).toBeTruthy()
    expect(getByTestId('add-card-modal-cvc-input')).toBeTruthy()
  })

  it('should not render modal when not visible', () => {
    const { queryByText } = render(
      <AddCardModal
        visible={false}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    expect(queryByText('Agregar Tarjeta de Crédito')).toBeNull()
  })

  it('should call onClose when close button is pressed', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const closeButton = getByTestId('add-card-modal-close-btn')
    fireEvent.press(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when cancel button is pressed', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const cancelButton = getByTestId('add-card-modal-cancel-btn')
    fireEvent.press(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should have submit button disabled by default', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const submitButton = getByTestId('add-card-modal-submit-btn')
    expect(submitButton.props.accessibilityState.disabled).toBe(true)
  })

  it('should format card number with spaces', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const numberInput = getByTestId('add-card-modal-number-input')
    fireEvent.changeText(numberInput, '1234567890123456')

    expect(numberInput.props.value).toBe('1234 5678 9012 3456')
  })

  it('should convert cardholder name to uppercase', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const holderInput = getByTestId('add-card-modal-holder-input')
    fireEvent.changeText(holderInput, 'john doe')

    expect(holderInput.props.value).toBe('JOHN DOE')
  })

  it('should limit card number to 16 digits', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const numberInput = getByTestId('add-card-modal-number-input')
    fireEvent.changeText(numberInput, '12345678901234567890')

    expect(numberInput.props.value.replace(/\s/g, '').length).toBeLessThanOrEqual(16)
  })

  it('should limit CVC to 4 digits', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const cvcInput = getByTestId('add-card-modal-cvc-input')
    fireEvent.changeText(cvcInput, '12345')

    expect(cvcInput.props.value.length).toBeLessThanOrEqual(4)
  })

  it('should limit month to 2 digits', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const monthInput = getByTestId('add-card-modal-month-input')
    fireEvent.changeText(monthInput, '123')

    expect(monthInput.props.value.length).toBeLessThanOrEqual(2)
  })

  it('should limit year to 2 digits', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const yearInput = getByTestId('add-card-modal-year-input')
    fireEvent.changeText(yearInput, '2025')

    expect(yearInput.props.value.length).toBeLessThanOrEqual(2)
  })

  it('should show error for invalid card number', async () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const numberInput = getByTestId('add-card-modal-number-input')
    fireEvent.changeText(numberInput, '1234')
    fireEvent(numberInput, 'blur')

    await waitFor(() => {
      expect(getByTestId('add-card-modal-number-error')).toBeTruthy()
    })
  })

  it('should show error for invalid CVC', async () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const cvcInput = getByTestId('add-card-modal-cvc-input')
    fireEvent.changeText(cvcInput, '12')
    fireEvent(cvcInput, 'blur')

    await waitFor(() => {
      expect(getByTestId('add-card-modal-cvc-error')).toBeTruthy()
    })
  })

  it('should show error for invalid month', async () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const monthInput = getByTestId('add-card-modal-month-input')
    fireEvent.changeText(monthInput, '13')
    fireEvent(monthInput, 'blur')

    await waitFor(() => {
      expect(getByTestId('add-card-modal-month-error')).toBeTruthy()
    })
  })

  it('should show error for past year', async () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const yearInput = getByTestId('add-card-modal-year-input')
    fireEvent.changeText(yearInput, '20')
    fireEvent(yearInput, 'blur')

    await waitFor(() => {
      expect(getByTestId('add-card-modal-year-error')).toBeTruthy()
    })
  })

  it('should show error for invalid cardholder name', async () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const holderInput = getByTestId('add-card-modal-holder-input')
    fireEvent.changeText(holderInput, 'J')
    fireEvent(holderInput, 'blur')

    await waitFor(() => {
      expect(getByTestId('add-card-modal-holder-error')).toBeTruthy()
    })
  })

  it('should show terms and conditions checkbox', () => {
    const { getByTestId, getByText } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    expect(getByTestId('add-card-modal-terms-checkbox')).toBeTruthy()
    expect(getByText('Acepto los')).toBeTruthy()
    expect(getByText('Términos y Condiciones')).toBeTruthy()
  })

  it('should toggle terms checkbox', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const checkbox = getByTestId('add-card-modal-terms-checkbox')
    expect(checkbox.props.accessibilityState.checked).toBe(false)

    fireEvent.press(checkbox)
    expect(checkbox.props.accessibilityState.checked).toBe(true)
  })

  it('should keep submit button disabled when terms not accepted', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const numberInput = getByTestId('add-card-modal-number-input')
    const holderInput = getByTestId('add-card-modal-holder-input')
    const emailInput = getByTestId('add-card-modal-email-input')
    const monthInput = getByTestId('add-card-modal-month-input')
    const yearInput = getByTestId('add-card-modal-year-input')
    const cvcInput = getByTestId('add-card-modal-cvc-input')

    fireEvent.changeText(numberInput, '4111111111111111')
    fireEvent.changeText(holderInput, 'JOHN DOE')
    fireEvent.changeText(emailInput, 'john@example.com')
    fireEvent.changeText(monthInput, '12')
    fireEvent.changeText(yearInput, '25')
    fireEvent.changeText(cvcInput, '123')

    const submitButton = getByTestId('add-card-modal-submit-btn')
    expect(submitButton.props.accessibilityState.disabled).toBe(true)
  })

  it('should enable submit button when form is valid and terms accepted', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const numberInput = getByTestId('add-card-modal-number-input')
    const holderInput = getByTestId('add-card-modal-holder-input')
    const emailInput = getByTestId('add-card-modal-email-input')
    const monthInput = getByTestId('add-card-modal-month-input')
    const yearInput = getByTestId('add-card-modal-year-input')
    const cvcInput = getByTestId('add-card-modal-cvc-input')
    const checkbox = getByTestId('add-card-modal-terms-checkbox')

    fireEvent.changeText(numberInput, '4111111111111111')
    fireEvent.changeText(holderInput, 'JOHN DOE')
    fireEvent.changeText(emailInput, 'john@example.com')
    fireEvent.changeText(monthInput, '12')
    fireEvent.changeText(yearInput, '25')
    fireEvent.changeText(cvcInput, '123')
    fireEvent.press(checkbox)

    const submitButton = getByTestId('add-card-modal-submit-btn')
    expect(submitButton.props.accessibilityState.disabled).toBe(false)
  })

  it('should call onAddCard with formatted data when form is submitted', async () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const numberInput = getByTestId('add-card-modal-number-input')
    const holderInput = getByTestId('add-card-modal-holder-input')
    const emailInput = getByTestId('add-card-modal-email-input')
    const monthInput = getByTestId('add-card-modal-month-input')
    const yearInput = getByTestId('add-card-modal-year-input')
    const cvcInput = getByTestId('add-card-modal-cvc-input')
    const checkbox = getByTestId('add-card-modal-terms-checkbox')
    const submitButton = getByTestId('add-card-modal-submit-btn')

    fireEvent.changeText(numberInput, '4111111111111111')
    fireEvent.changeText(holderInput, 'john doe')
    fireEvent.changeText(emailInput, 'john@example.com')
    fireEvent.changeText(monthInput, '12')
    fireEvent.changeText(yearInput, '25')
    fireEvent.changeText(cvcInput, '123')
    fireEvent.press(checkbox)
    fireEvent.press(submitButton)

    await waitFor(() => {
      expect(mockOnAddCard).toHaveBeenCalledWith({
        number: '4111111111111111',
        cvc: '123',
        exp_month: '12',
        exp_year: '25',
        card_holder: 'JOHN DOE',
        email: 'john@example.com',
      })
    })
  })

  it('should validate email format', async () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const emailInput = getByTestId('add-card-modal-email-input')
    fireEvent.changeText(emailInput, 'invalid-email')
    fireEvent(emailInput, 'blur')

    await waitFor(() => {
      expect(getByTestId('add-card-modal-email-error')).toBeTruthy()
    })
  })

  it('should accept valid email format', async () => {
    const { getByTestId, queryByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const emailInput = getByTestId('add-card-modal-email-input')
    fireEvent.changeText(emailInput, 'user@example.com')
    fireEvent(emailInput, 'blur')

    await waitFor(() => {
      expect(queryByTestId('add-card-modal-email-error')).toBeNull()
    })
  })

  it('should show error for empty email', async () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    const emailInput = getByTestId('add-card-modal-email-input')
    fireEvent.changeText(emailInput, '')
    fireEvent(emailInput, 'blur')

    await waitFor(() => {
      expect(getByTestId('add-card-modal-email-error')).toBeTruthy()
    })
  })

  it('should render terms and conditions as a link', () => {
    const { getByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        termsUrl="https://example.com/terms.pdf"
        testID="add-card-modal"
      />
    )

    expect(getByTestId('add-card-modal-terms-link')).toBeTruthy()
  })

  it('should render terms as plain text when no URL provided', () => {
    const { queryByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    expect(queryByTestId('add-card-modal-terms-link')).toBeNull()
  })

  it('should not call Linking when no terms URL provided', async () => {
    const { queryByTestId } = render(
      <AddCardModal
        visible={true}
        onClose={mockOnClose}
        onAddCard={mockOnAddCard}
        testID="add-card-modal"
      />
    )

    expect(queryByTestId('add-card-modal-terms-link')).toBeNull()
  })
})