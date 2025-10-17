import { fireEvent, render, screen } from '@testing-library/react-native'

import { StepperInput } from '../../atom'
import { Colors } from '../../../constants/theme'

jest.mock('../../../hooks/useResponsive', () => ({
  useResponsive: jest.fn(() => ({
    isSmallPhone: false,
    isLargePhone: false,
  })),
}))

jest.mock('../../../hooks/useThemeColor', () => ({
  useThemeColor: jest.fn((_, key) => {
    const colors: any = {
      background: '#ecd0ec',
      primary: '#7e2a53',
      secondary: '#441b2a',
      textPrimary: '#1a0f15',
      textSecondary: 'rgba(26, 15, 21, 0.7)',
      tint: '#ba71a2',
      success: '#2E7D32',
      warning: '#ED6C02',
      error: '#D32F2F',
      disabled: 'rgba(26, 15, 21, 0.3)',
      white: '#FFFFFF',
    }
    return colors[key] ?? '#000000'
  }),
}))

describe('Rendering', () => {
  it('should render without crashing', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    expect(screen.getByTestId('stepper')).toBeTruthy()
  })

  it('should render with default props', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={10} onChange={onChange} testID="default-stepper" />,
    )
    expect(screen.getByTestId('default-stepper')).toBeTruthy()
    expect(screen.getByText('10')).toBeTruthy()
  })

  it('should render decrement button', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    expect(screen.getByTestId('stepper-decrement')).toBeTruthy()
  })

  it('should render increment button', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    expect(screen.getByTestId('stepper-increment')).toBeTruthy()
  })

  it('should display current value', () => {
    const onChange = jest.fn()
    render(<StepperInput value={42} onChange={onChange} testID="stepper" />)
    expect(screen.getByText('42')).toBeTruthy()
  })
})

describe('Size Variants', () => {
  it('should render with sm size', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        size="sm"
        value={5}
        onChange={onChange}
        testID="sm-stepper"
      />,
    )
    const stepper = screen.getByTestId('sm-stepper')
    expect(stepper.props.style.height).toBe(32)
  })

  it('should render with base size', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        size="base"
        value={5}
        onChange={onChange}
        testID="base-stepper"
      />,
    )
    const stepper = screen.getByTestId('base-stepper')
    expect(stepper.props.style.height).toBe(40)
  })

  it('should render with lg size', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        size="lg"
        value={5}
        onChange={onChange}
        testID="lg-stepper"
      />,
    )
    const stepper = screen.getByTestId('lg-stepper')
    expect(stepper.props.style.height).toBe(48)
  })
})

describe('Variant Styles', () => {
  it('should render with default variant', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        variant="default"
        value={5}
        onChange={onChange}
        testID="default-variant"
      />,
    )
    const stepper = screen.getByTestId('default-variant')
    expect(stepper.props.style.borderWidth).toBe(1)
  })

  it('should render with outlined variant', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        variant="outlined"
        value={5}
        onChange={onChange}
        testID="outlined-variant"
      />,
    )
    const stepper = screen.getByTestId('outlined-variant')
    expect(stepper.props.style.backgroundColor).toBe('transparent')
    expect(stepper.props.style.borderWidth).toBe(1)
  })

  it('should render with filled variant', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        variant="filled"
        value={5}
        onChange={onChange}
        testID="filled-variant"
      />,
    )
    const stepper = screen.getByTestId('filled-variant')
    expect(stepper.props.style.backgroundColor).toBe(Colors.light.background)
  })
})

describe('Shape Variants', () => {
  it('should render with square shape', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        shape="square"
        value={5}
        onChange={onChange}
        testID="square-stepper"
      />,
    )
    const stepper = screen.getByTestId('square-stepper')
    expect(stepper.props.style.borderRadius).toBe(0)
  })

  it('should render with rounded shape', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        shape="rounded"
        value={5}
        onChange={onChange}
        testID="rounded-stepper"
      />,
    )
    const stepper = screen.getByTestId('rounded-stepper')
    expect(stepper.props.style.borderRadius).toBe(8)
  })

  it('should render with circular shape', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        shape="circular"
        value={5}
        onChange={onChange}
        testID="circular-stepper"
      />,
    )
    const stepper = screen.getByTestId('circular-stepper')
    expect(stepper.props.style.borderRadius).toBe(9999)
  })
})

describe('Increment Functionality', () => {
  it('should increment value by default step (1)', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    fireEvent.press(screen.getByTestId('stepper-increment'))
    expect(onChange).toHaveBeenCalledWith(6)
  })

  it('should increment value by custom step', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={5} step={5} onChange={onChange} testID="stepper" />,
    )
    fireEvent.press(screen.getByTestId('stepper-increment'))
    expect(onChange).toHaveBeenCalledWith(10)
  })

  it('should not increment beyond max value', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={9} max={10} onChange={onChange} testID="stepper" />,
    )
    fireEvent.press(screen.getByTestId('stepper-increment'))
    fireEvent.press(screen.getByTestId('stepper-increment'))
    expect(onChange).toHaveBeenCalledWith(10)
  })
})

describe('Decrement Functionality', () => {
  it('should decrement value by default step (1)', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    fireEvent.press(screen.getByTestId('stepper-decrement'))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('should decrement value by custom step', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={10} step={3} onChange={onChange} testID="stepper" />,
    )
    fireEvent.press(screen.getByTestId('stepper-decrement'))
    expect(onChange).toHaveBeenCalledWith(7)
  })

  it('should not decrement below min value', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={1} min={0} onChange={onChange} testID="stepper" />,
    )
    fireEvent.press(screen.getByTestId('stepper-decrement'))
    fireEvent.press(screen.getByTestId('stepper-decrement'))
    expect(onChange).toHaveBeenCalledWith(0)
  })
})

describe('Min and Max Constraints', () => {
  it('should respect default min value of 0', () => {
    const onChange = jest.fn()
    render(<StepperInput value={1} onChange={onChange} testID="stepper" />)
    fireEvent.press(screen.getByTestId('stepper-decrement'))
    fireEvent.press(screen.getByTestId('stepper-decrement'))
    expect(onChange).toHaveBeenCalledWith(0)
  })

  it('should respect custom min value', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={6} min={5} onChange={onChange} testID="stepper" />,
    )
    fireEvent.press(screen.getByTestId('stepper-decrement'))
    fireEvent.press(screen.getByTestId('stepper-decrement'))
    expect(onChange).toHaveBeenLastCalledWith(5)
  })

  it('should respect custom max value', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={99}
        max={100}
        onChange={onChange}
        testID="stepper"
      />,
    )
    fireEvent.press(screen.getByTestId('stepper-increment'))
    fireEvent.press(screen.getByTestId('stepper-increment'))
    expect(onChange).toHaveBeenLastCalledWith(100)
  })

  it('should work with negative min values', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={-5}
        min={-10}
        onChange={onChange}
        testID="stepper"
      />,
    )
    fireEvent.press(screen.getByTestId('stepper-decrement'))
    expect(onChange).toHaveBeenCalledWith(-6)
  })
})

describe('Disabled State', () => {
  it('should not increment when disabled', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={5} disabled onChange={onChange} testID="stepper" />,
    )
    fireEvent.press(screen.getByTestId('stepper-increment'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should not decrement when disabled', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={5} disabled onChange={onChange} testID="stepper" />,
    )
    fireEvent.press(screen.getByTestId('stepper-decrement'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should disable increment button at max value', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={10} max={10} onChange={onChange} testID="stepper" />,
    )
    const incrementBtn = screen.getByTestId('stepper-increment')
    expect(incrementBtn.props.accessibilityState.disabled).toBe(true)
  })

  it('should disable decrement button at min value', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={0} min={0} onChange={onChange} testID="stepper" />,
    )
    const decrementBtn = screen.getByTestId('stepper-decrement')
    expect(decrementBtn.props.accessibilityState.disabled).toBe(true)
  })
})

describe('Editable Input', () => {
  it('should render TextInput when editable is true', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={5} editable onChange={onChange} testID="stepper" />,
    )
    expect(screen.getByTestId('stepper-input')).toBeTruthy()
  })

  it('should render Text when editable is false', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={5}
        editable={false}
        onChange={onChange}
        testID="stepper"
      />,
    )
    expect(screen.getByTestId('stepper-value')).toBeTruthy()
  })

  it('should handle text input changes', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={5} editable onChange={onChange} testID="stepper" />,
    )
    fireEvent.changeText(screen.getByTestId('stepper-input'), '10')
    expect(onChange).toHaveBeenCalledWith(10)
  })

  it('should filter non-numeric characters', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={5} editable onChange={onChange} testID="stepper" />,
    )
    fireEvent.changeText(screen.getByTestId('stepper-input'), 'abc15xyz')
    expect(onChange).toHaveBeenCalledWith(15)
  })

  it('should handle decimal values', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={5} editable onChange={onChange} testID="stepper" />,
    )
    fireEvent.changeText(screen.getByTestId('stepper-input'), '3.14')
    expect(onChange).toHaveBeenCalledWith(3.14)
  })

  it('should handle negative values', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={5}
        min={-10}
        editable
        onChange={onChange}
        testID="stepper"
      />,
    )
    fireEvent.changeText(screen.getByTestId('stepper-input'), '-5')
    expect(onChange).toHaveBeenCalledWith(-5)
  })

  it('should set to min when input is cleared', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={5}
        min={0}
        editable
        onChange={onChange}
        testID="stepper"
      />,
    )
    fireEvent.changeText(screen.getByTestId('stepper-input'), '')
    expect(onChange).toHaveBeenCalledWith(0)
  })
})

describe('Custom Icons', () => {
  const MockIcon = () => null

  it('should render custom decrement icon', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={5}
        decrementIcon={<MockIcon />}
        onChange={onChange}
        testID="stepper"
      />,
    )
    expect(screen.getByTestId('stepper-decrement')).toBeTruthy()
  })

  it('should render custom increment icon', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={5}
        incrementIcon={<MockIcon />}
        onChange={onChange}
        testID="stepper"
      />,
    )
    expect(screen.getByTestId('stepper-increment')).toBeTruthy()
  })
})

describe('Prefix and Suffix', () => {
  it('should display prefix', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={5}
        prefix="$"
        onChange={onChange}
        testID="stepper"
      />,
    )
    expect(screen.getByText('$5')).toBeTruthy()
  })

  it('should display suffix', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={5}
        suffix="kg"
        onChange={onChange}
        testID="stepper"
      />,
    )
    expect(screen.getByText('5kg')).toBeTruthy()
  })

  it('should display both prefix and suffix', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={5}
        prefix="$"
        suffix=" USD"
        onChange={onChange}
        testID="stepper"
      />,
    )
    expect(screen.getByText('$5 USD')).toBeTruthy()
  })
})

describe('Format Value', () => {
  it('should format value with custom formatter', () => {
    const onChange = jest.fn()
    const formatValue = (val: number) => val.toFixed(2)
    render(
      <StepperInput
        value={5}
        formatValue={formatValue}
        onChange={onChange}
        testID="stepper"
      />,
    )
    expect(screen.getByText('5.00')).toBeTruthy()
  })

  it('should format value with prefix and custom formatter', () => {
    const onChange = jest.fn()
    const formatValue = (val: number) => val.toFixed(2)
    render(
      <StepperInput
        value={5}
        prefix="$"
        formatValue={formatValue}
        onChange={onChange}
        testID="stepper"
      />,
    )
    expect(screen.getByText('$5.00')).toBeTruthy()
  })
})

describe('Show Value', () => {
  it('should show value by default', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    expect(screen.getByText('5')).toBeTruthy()
  })

  it('should hide value when showValue is false', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={5}
        showValue={false}
        onChange={onChange}
        testID="stepper"
      />,
    )
    expect(screen.queryByTestId('stepper-value')).toBeNull()
  })
})

describe('Responsive Behavior', () => {
  it('should render with responsive sizing', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: false,
    })
    const onChange = jest.fn()
    render(
      <StepperInput
        responsive
        value={5}
        onChange={onChange}
        testID="responsive-stepper"
      />,
    )
    const stepper = screen.getByTestId('responsive-stepper')
    expect(stepper.props.style.height).toBe(40)
  })

  it('should apply mobile adjustments for small phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    const onChange = jest.fn()
    render(
      <StepperInput
        responsive
        value={5}
        onChange={onChange}
        testID="small-phone-stepper"
      />,
    )
    const stepper = screen.getByTestId('small-phone-stepper')
    expect(stepper.props.style.height).toBeLessThan(40)
  })

  it('should apply mobile adjustments for large phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: true,
    })

    const onChange = jest.fn()
    render(
      <StepperInput
        responsive
        value={5}
        onChange={onChange}
        testID="large-phone-stepper"
      />,
    )
    const stepper = screen.getByTestId('large-phone-stepper')
    expect(stepper.props.style.height).toBeGreaterThan(40)
  })
})

describe('Accessibility', () => {
  it('should have correct accessibility role for buttons', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    const incrementBtn = screen.getByTestId('stepper-increment')
    const decrementBtn = screen.getByTestId('stepper-decrement')
    expect(incrementBtn.props.accessibilityRole).toBe('button')
    expect(decrementBtn.props.accessibilityRole).toBe('button')
  })

  it('should have accessibility labels', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    const incrementBtn = screen.getByTestId('stepper-increment')
    const decrementBtn = screen.getByTestId('stepper-decrement')
    expect(incrementBtn.props.accessibilityLabel).toBe('Increase value')
    expect(decrementBtn.props.accessibilityLabel).toBe('Decrease value')
  })

  it('should indicate disabled state in accessibility', () => {
    const onChange = jest.fn()
    render(
      <StepperInput value={0} min={0} onChange={onChange} testID="stepper" />,
    )
    const decrementBtn = screen.getByTestId('stepper-decrement')
    expect(decrementBtn.props.accessibilityState.disabled).toBe(true)
  })

  it('should have accessibility value for input', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={5}
        min={0}
        max={10}
        editable
        onChange={onChange}
        testID="stepper"
      />,
    )
    const input = screen.getByTestId('stepper-input')
    expect(input.props.accessibilityValue).toEqual({ now: 5, min: 0, max: 10 })
  })
})

describe('Custom Styles', () => {
  it('should accept custom styles', () => {
    const onChange = jest.fn()
    const customStyle = { marginTop: 20 }
    render(
      <StepperInput
        value={5}
        style={customStyle}
        onChange={onChange}
        testID="custom-style-stepper"
      />,
    )
    const stepper = screen.getByTestId('custom-style-stepper')
    expect(stepper.props.style.marginTop).toBe(20)
  })
})

describe('Step Values', () => {
  it('should use step of 1 by default', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    fireEvent.press(screen.getByTestId('stepper-increment'))
    expect(onChange).toHaveBeenCalledWith(6)
  })

  it('should support decimal step values', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={1}
        step={0.1}
        onChange={onChange}
        testID="stepper"
      />,
    )
    fireEvent.press(screen.getByTestId('stepper-increment'))
    expect(onChange).toHaveBeenCalledWith(1.1)
  })

  it('should support large step values', () => {
    const onChange = jest.fn()
    render(
      <StepperInput
        value={0}
        step={100}
        onChange={onChange}
        testID="stepper"
      />,
    )
    fireEvent.press(screen.getByTestId('stepper-increment'))
    expect(onChange).toHaveBeenCalledWith(100)
  })
})

describe('Layout Properties', () => {
  it('should have flexDirection row', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    const stepper = screen.getByTestId('stepper')
    expect(stepper.props.style.flexDirection).toBe('row')
  })

  it('should have alignItems center', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    const stepper = screen.getByTestId('stepper')
    expect(stepper.props.style.alignItems).toBe('center')
  })

  it('should have overflow hidden', () => {
    const onChange = jest.fn()
    render(<StepperInput value={5} onChange={onChange} testID="stepper" />)
    const stepper = screen.getByTestId('stepper')
    expect(stepper.props.style.overflow).toBe('hidden')
  })
})
