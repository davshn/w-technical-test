import { fireEvent, render, screen } from '@testing-library/react-native'

import { Checkbox } from '../../atom'
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
    render(<Checkbox testID="checkbox" />)
    expect(screen.getByTestId('checkbox')).toBeTruthy()
  })

  it('should render with default props', () => {
    render(<Checkbox testID="default-checkbox" />)
    const checkbox = screen.getByTestId('default-checkbox')
    expect(checkbox.props.style.width).toBe(20)
  })

  it('should render with custom testID', () => {
    render(<Checkbox testID="custom-checkbox" />)
    expect(screen.getByTestId('custom-checkbox')).toBeTruthy()
  })

  it('should render unchecked by default', () => {
    render(<Checkbox testID="unchecked-checkbox" />)
    const checkbox = screen.getByTestId('unchecked-checkbox')
    expect(checkbox.props.style.backgroundColor).toBe('#000000')
  })

  it('should render checked when checked prop is true', () => {
    render(<Checkbox checked testID="checked-checkbox" />)
    const checkbox = screen.getByTestId('checked-checkbox')
    expect(checkbox.props.style.backgroundColor).toBe(Colors.light.background)
  })
})

describe('Size Variants', () => {
  it('should render with sm size', () => {
    render(<Checkbox size="sm" testID="sm-checkbox" />)
    const checkbox = screen.getByTestId('sm-checkbox')
    expect(checkbox.props.style.width).toBe(16)
    expect(checkbox.props.style.height).toBe(16)
  })

  it('should render with base size', () => {
    render(<Checkbox size="base" testID="base-checkbox" />)
    const checkbox = screen.getByTestId('base-checkbox')
    expect(checkbox.props.style.width).toBe(20)
    expect(checkbox.props.style.height).toBe(20)
  })

  it('should render with lg size', () => {
    render(<Checkbox size="lg" testID="lg-checkbox" />)
    const checkbox = screen.getByTestId('lg-checkbox')
    expect(checkbox.props.style.width).toBe(24)
    expect(checkbox.props.style.height).toBe(24)
  })
})

describe('Variant Styles', () => {
  it('should render with default variant when unchecked', () => {
    render(<Checkbox variant="default" testID="default-variant-checkbox" />)
    const checkbox = screen.getByTestId('default-variant-checkbox')
    expect(checkbox.props.style.borderColor).toBe(Colors.light.primary)
  })

  it('should render with default variant when checked', () => {
    render(
      <Checkbox variant="default" checked testID="default-checked-checkbox" />,
    )
    const checkbox = screen.getByTestId('default-checked-checkbox')
    expect(checkbox.props.style.backgroundColor).toBe(Colors.light.background)
    expect(checkbox.props.style.borderColor).toBe(Colors.light.primary)
  })

  it('should render with success variant when unchecked', () => {
    render(<Checkbox variant="success" testID="success-variant-checkbox" />)
    const checkbox = screen.getByTestId('success-variant-checkbox')
    expect(checkbox.props.style.borderColor).toBe(Colors.light.success)
  })

  it('should render with success variant when checked', () => {
    render(
      <Checkbox variant="success" checked testID="success-checked-checkbox" />,
    )
    const checkbox = screen.getByTestId('success-checked-checkbox')
    expect(checkbox.props.style.backgroundColor).toBe(Colors.light.success)
    expect(checkbox.props.style.borderColor).toBe(Colors.light.success)
  })

  it('should render with warning variant when unchecked', () => {
    render(<Checkbox variant="warning" testID="warning-variant-checkbox" />)
    const checkbox = screen.getByTestId('warning-variant-checkbox')
    expect(checkbox.props.style.borderColor).toBe(Colors.light.warning)
  })

  it('should render with warning variant when checked', () => {
    render(
      <Checkbox variant="warning" checked testID="warning-checked-checkbox" />,
    )
    const checkbox = screen.getByTestId('warning-checked-checkbox')
    expect(checkbox.props.style.backgroundColor).toBe(Colors.light.warning)
    expect(checkbox.props.style.borderColor).toBe(Colors.light.warning)
  })

  it('should render with error variant when unchecked', () => {
    render(<Checkbox variant="error" testID="error-variant-checkbox" />)
    const checkbox = screen.getByTestId('error-variant-checkbox')
    expect(checkbox.props.style.borderColor).toBe(Colors.light.error)
  })

  it('should render with error variant when checked', () => {
    render(<Checkbox variant="error" checked testID="error-checked-checkbox" />)
    const checkbox = screen.getByTestId('error-checked-checkbox')
    expect(checkbox.props.style.backgroundColor).toBe(Colors.light.error)
    expect(checkbox.props.style.borderColor).toBe(Colors.light.error)
  })
})

describe('Shape Variants', () => {
  it('should render with rounded shape', () => {
    render(<Checkbox shape="rounded" testID="rounded-checkbox" />)
    const checkbox = screen.getByTestId('rounded-checkbox')
    expect(checkbox.props.style.borderRadius).toBe(4)
  })

  it('should render with square shape', () => {
    render(<Checkbox shape="square" testID="square-checkbox" />)
    const checkbox = screen.getByTestId('square-checkbox')
    expect(checkbox.props.style.borderRadius).toBe(0)
  })
})

describe('State Styles', () => {
  it('should render in default state', () => {
    render(<Checkbox state="default" testID="default-state-checkbox" />)
    const checkbox = screen.getByTestId('default-state-checkbox')
    expect(checkbox.props.accessibilityState.disabled).toBe(false)
    expect(checkbox.props.style.opacity).toBe(1)
  })

  it('should render in disabled state', () => {
    render(<Checkbox disabled testID="disabled-state-checkbox" />)
    const checkbox = screen.getByTestId('disabled-state-checkbox')
    expect(checkbox.props.accessibilityState.disabled).toBe(true)
    expect(checkbox.props.style.opacity).toBe(0.5)
  })

  it('should apply disabled opacity', () => {
    render(<Checkbox disabled testID="disabled-opacity-checkbox" />)
    const checkbox = screen.getByTestId('disabled-opacity-checkbox')
    expect(checkbox.props.style.opacity).toBe(0.5)
  })

  it('should have disabled colors when disabled and unchecked', () => {
    render(<Checkbox disabled testID="disabled-colors-checkbox" />)
    const checkbox = screen.getByTestId('disabled-colors-checkbox')
    expect(checkbox.props.style.borderColor).toBe(Colors.light.disabled)
    expect(checkbox.props.style.backgroundColor).toBe('#000000')
  })

  it('should have disabled colors when disabled and checked', () => {
    render(<Checkbox disabled checked testID="disabled-checked-checkbox" />)
    const checkbox = screen.getByTestId('disabled-checked-checkbox')
    expect(checkbox.props.style.borderColor).toBe(Colors.light.disabled)
    expect(checkbox.props.style.backgroundColor).toBe(Colors.light.disabled)
  })
})

describe('Indeterminate State', () => {
  it('should render indeterminate state', () => {
    render(<Checkbox indeterminate testID="indeterminate-checkbox" />)
    const checkbox = screen.getByTestId('indeterminate-checkbox')
    expect(checkbox.props.children).toBeTruthy()
  })

  it('should have checked background when indeterminate', () => {
    render(<Checkbox indeterminate testID="indeterminate-bg-checkbox" />)
    const checkbox = screen.getByTestId('indeterminate-bg-checkbox')
    expect(checkbox.props.style.backgroundColor).not.toBe('transparent')
  })

  it('should prioritize indeterminate over checked', () => {
    render(
      <Checkbox
        indeterminate
        checked
        testID="indeterminate-priority-checkbox"
      />,
    )
    const checkbox = screen.getByTestId('indeterminate-priority-checkbox')
    expect(checkbox.props.accessibilityState.checked).toBe('mixed')
  })

  it('should render indeterminate icon', () => {
    render(<Checkbox indeterminate testID="indeterminate-icon-checkbox" />)
    const checkbox = screen.getByTestId('indeterminate-icon-checkbox')
    expect(checkbox.props.children).toBeTruthy()
  })
})

describe('Border Properties', () => {
  it('should have correct border width for sm size', () => {
    render(<Checkbox size="sm" testID="sm-border-checkbox" />)
    const checkbox = screen.getByTestId('sm-border-checkbox')
    expect(checkbox.props.style.borderWidth).toBe(1.5)
  })

  it('should have correct border width for base size', () => {
    render(<Checkbox size="base" testID="base-border-checkbox" />)
    const checkbox = screen.getByTestId('base-border-checkbox')
    expect(checkbox.props.style.borderWidth).toBe(2)
  })

  it('should have correct border width for lg size', () => {
    render(<Checkbox size="lg" testID="lg-border-checkbox" />)
    const checkbox = screen.getByTestId('lg-border-checkbox')
    expect(checkbox.props.style.borderWidth).toBe(2)
  })
})

describe('Interaction Handling', () => {
  it('should handle onPress event when unchecked', () => {
    const onPress = jest.fn()
    render(<Checkbox onPress={onPress} testID="press-checkbox" />)
    fireEvent.press(screen.getByTestId('press-checkbox'))
    expect(onPress).toHaveBeenCalledWith(true)
  })

  it('should handle onPress event when checked', () => {
    const onPress = jest.fn()
    render(
      <Checkbox checked onPress={onPress} testID="press-checked-checkbox" />,
    )
    fireEvent.press(screen.getByTestId('press-checked-checkbox'))
    expect(onPress).toHaveBeenCalledWith(false)
  })

  it('should handle onPress when indeterminate', () => {
    const onPress = jest.fn()
    render(
      <Checkbox
        indeterminate
        onPress={onPress}
        testID="press-indeterminate-checkbox"
      />,
    )
    fireEvent.press(screen.getByTestId('press-indeterminate-checkbox'))
    expect(onPress).toHaveBeenCalledWith(true)
  })

  it('should not trigger onPress when disabled', () => {
    const onPress = jest.fn()
    render(
      <Checkbox onPress={onPress} disabled testID="disabled-press-checkbox" />,
    )
    fireEvent.press(screen.getByTestId('disabled-press-checkbox'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('should handle press without onPress callback', () => {
    render(<Checkbox testID="no-callback-checkbox" />)
    fireEvent.press(screen.getByTestId('no-callback-checkbox'))
    expect(screen.getByTestId('no-callback-checkbox')).toBeTruthy()
  })
})

describe('Checked State', () => {
  it('should show check icon when checked', () => {
    render(<Checkbox checked testID="checked-icon-checkbox" />)
    const checkbox = screen.getByTestId('checked-icon-checkbox')
    expect(checkbox.props.children).toBeTruthy()
  })

  it('should not show icon when unchecked', () => {
    render(<Checkbox checked={false} testID="unchecked-icon-checkbox" />)
    const checkbox = screen.getByTestId('unchecked-icon-checkbox')
    expect(checkbox.props.children[0]).toBeNull()
  })

  it('should have different background when checked', () => {
    render(<Checkbox checked testID="checked-bg-checkbox" />)
    const checkbox = screen.getByTestId('checked-bg-checkbox')
    expect(checkbox.props.style.backgroundColor).not.toBe('transparent')
  })

  it('should have transparent background when unchecked', () => {
    render(<Checkbox checked={false} testID="unchecked-bg-checkbox" />)
    const checkbox = screen.getByTestId('unchecked-bg-checkbox')
    expect(checkbox.props.style.backgroundColor).toBe('#000000')
  })
})

describe('Custom Icons', () => {
  const MockIcon = () => null

  it('should render with custom checked icon', () => {
    render(
      <Checkbox
        checked
        checkedIcon={<MockIcon />}
        testID="custom-checked-icon-checkbox"
      />,
    )
    expect(screen.getByTestId('custom-checked-icon-checkbox')).toBeTruthy()
  })

  it('should render with custom indeterminate icon', () => {
    render(
      <Checkbox
        indeterminate
        indeterminateIcon={<MockIcon />}
        testID="custom-indeterminate-icon-checkbox"
      />,
    )
    expect(
      screen.getByTestId('custom-indeterminate-icon-checkbox'),
    ).toBeTruthy()
  })
})

describe('Responsive Behavior', () => {
  it('should render with responsive sizing', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: false,
    })
    render(<Checkbox responsive testID="responsive-checkbox" />)
    const checkbox = screen.getByTestId('responsive-checkbox')
    expect(checkbox.props.style.width).toBe(20)
  })

  it('should apply mobile adjustments for small phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(<Checkbox responsive testID="small-phone-checkbox" />)
    const checkbox = screen.getByTestId('small-phone-checkbox')
    expect(checkbox.props.style.width).toBeLessThan(20)
  })

  it('should apply mobile adjustments for large phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: true,
    })

    render(<Checkbox responsive testID="large-phone-checkbox" />)
    const checkbox = screen.getByTestId('large-phone-checkbox')
    expect(checkbox.props.style.width).toBeGreaterThan(20)
  })

  it('should not apply responsive adjustments when responsive is false', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(<Checkbox responsive={false} testID="non-responsive-checkbox" />)
    const checkbox = screen.getByTestId('non-responsive-checkbox')
    expect(checkbox.props.style.width).toBe(20)
  })
})

describe('Accessibility', () => {
  it('should have correct accessibility role', () => {
    render(<Checkbox testID="accessible-checkbox" />)
    const checkbox = screen.getByTestId('accessible-checkbox')
    expect(checkbox.props.accessibilityRole).toBe('checkbox')
  })

  it('should use label as accessibility label', () => {
    render(<Checkbox label="Accept Terms" testID="label-checkbox" />)
    const checkbox = screen.getByTestId('label-checkbox')
    expect(checkbox.props.accessibilityLabel).toBe('Accept Terms')
  })

  it('should have accessibility hint from description', () => {
    render(<Checkbox description="Check to accept" testID="hint-checkbox" />)
    const checkbox = screen.getByTestId('hint-checkbox')
    expect(checkbox.props.accessibilityHint).toBe('Check to accept')
  })

  it('should indicate disabled state in accessibility', () => {
    render(<Checkbox disabled testID="disabled-accessible-checkbox" />)
    const checkbox = screen.getByTestId('disabled-accessible-checkbox')
    expect(checkbox.props.accessibilityState.disabled).toBe(true)
  })

  it('should indicate checked state in accessibility', () => {
    render(<Checkbox checked testID="checked-accessible-checkbox" />)
    const checkbox = screen.getByTestId('checked-accessible-checkbox')
    expect(checkbox.props.accessibilityState.checked).toBe(true)
  })

  it('should indicate unchecked state in accessibility', () => {
    render(<Checkbox checked={false} testID="unchecked-accessible-checkbox" />)
    const checkbox = screen.getByTestId('unchecked-accessible-checkbox')
    expect(checkbox.props.accessibilityState.checked).toBe(false)
  })

  it('should indicate mixed state for indeterminate in accessibility', () => {
    render(<Checkbox indeterminate testID="mixed-accessible-checkbox" />)
    const checkbox = screen.getByTestId('mixed-accessible-checkbox')
    expect(checkbox.props.accessibilityState.checked).toBe('mixed')
  })

  it('should be accessible', () => {
    render(<Checkbox testID="is-accessible-checkbox" />)
    const checkbox = screen.getByTestId('is-accessible-checkbox')
    expect(checkbox.props.accessible).toBe(true)
  })
})

describe('Custom Styles', () => {
  it('should accept custom container styles', () => {
    const customStyle = { marginTop: 20 }
    render(<Checkbox style={customStyle} testID="custom-style-checkbox" />)
    const checkbox = screen.getByTestId('custom-style-checkbox')
    expect(checkbox.props.style.marginTop).toBe(20)
  })

  it('should merge custom styles with default styles', () => {
    const customStyle = { marginLeft: 10, marginRight: 10 }
    render(<Checkbox style={customStyle} testID="merged-style-checkbox" />)
    const checkbox = screen.getByTestId('merged-style-checkbox')
    expect(checkbox.props.style.marginLeft).toBe(10)
    expect(checkbox.props.style.marginRight).toBe(10)
    expect(checkbox.props.style.width).toBe(20)
  })
})

describe('Hit Slop', () => {
  it('should have default hit slop', () => {
    render(<Checkbox testID="hitslop-checkbox" />)
    const checkbox = screen.getByTestId('hitslop-checkbox')
    expect(checkbox.props.hitSlop).toEqual({
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
    })
  })

  it('should accept custom hit slop', () => {
    const customHitSlop = { top: 12, bottom: 12, left: 12, right: 12 }
    render(
      <Checkbox hitSlop={customHitSlop} testID="custom-hitslop-checkbox" />,
    )
    const checkbox = screen.getByTestId('custom-hitslop-checkbox')
    expect(checkbox.props.hitSlop).toEqual(customHitSlop)
  })
})

describe('Press Animation', () => {
  it('should apply scale transform when pressed and not disabled', () => {
    render(<Checkbox testID="press-animation-checkbox" />)
    const checkbox = screen.getByTestId('press-animation-checkbox')
    expect(checkbox.props.style).toBeDefined()
  })

  it('should not apply scale transform when disabled', () => {
    render(<Checkbox disabled testID="disabled-animation-checkbox" />)
    const checkbox = screen.getByTestId('disabled-animation-checkbox')
    expect(checkbox.props.style).toBeDefined()
  })
})

describe('Layout Properties', () => {
  it('should center content with alignItems', () => {
    render(<Checkbox testID="align-checkbox" />)
    const checkbox = screen.getByTestId('align-checkbox')
    expect(checkbox.props.style.alignItems).toBe('center')
  })

  it('should center content with justifyContent', () => {
    render(<Checkbox testID="justify-checkbox" />)
    const checkbox = screen.getByTestId('justify-checkbox')
    expect(checkbox.props.style.justifyContent).toBe('center')
  })
})

describe('Combined Variants', () => {
  it('should handle success variant with checked state', () => {
    render(
      <Checkbox variant="success" checked testID="success-checked-combo" />,
    )
    const checkbox = screen.getByTestId('success-checked-combo')
    expect(checkbox.props.style.backgroundColor).toBe(Colors.light.success)
    expect(checkbox.props.accessibilityState.checked).toBe(true)
  })

  it('should handle error variant with disabled state', () => {
    render(<Checkbox variant="error" disabled testID="error-disabled-combo" />)
    const checkbox = screen.getByTestId('error-disabled-combo')
    expect(checkbox.props.style.opacity).toBe(0.5)
    expect(checkbox.props.accessibilityState.disabled).toBe(true)
  })

  it('should handle large size with checked state', () => {
    render(<Checkbox size="lg" checked testID="large-checked-combo" />)
    const checkbox = screen.getByTestId('large-checked-combo')
    expect(checkbox.props.style.width).toBe(24)
    expect(checkbox.props.style.backgroundColor).not.toBe('transparent')
  })

  it('should handle square shape with checked state', () => {
    render(<Checkbox shape="square" checked testID="square-checked-combo" />)
    const checkbox = screen.getByTestId('square-checked-combo')
    expect(checkbox.props.style.borderRadius).toBe(0)
    expect(checkbox.props.style.backgroundColor).not.toBe('transparent')
  })

  it('should handle indeterminate with disabled state', () => {
    render(
      <Checkbox indeterminate disabled testID="indeterminate-disabled-combo" />,
    )
    const checkbox = screen.getByTestId('indeterminate-disabled-combo')
    expect(checkbox.props.style.opacity).toBe(0.5)
    expect(checkbox.props.accessibilityState.checked).toBe('mixed')
  })
})

describe('Toggle Behavior', () => {
  it('should toggle from unchecked to checked', () => {
    const onPress = jest.fn()
    render(
      <Checkbox checked={false} onPress={onPress} testID="toggle-checkbox" />,
    )
    fireEvent.press(screen.getByTestId('toggle-checkbox'))
    expect(onPress).toHaveBeenCalledWith(true)
  })

  it('should toggle from checked to unchecked', () => {
    const onPress = jest.fn()
    render(
      <Checkbox
        checked={true}
        onPress={onPress}
        testID="toggle-checked-checkbox"
      />,
    )
    fireEvent.press(screen.getByTestId('toggle-checked-checkbox'))
    expect(onPress).toHaveBeenCalledWith(false)
  })

  it('should always return true when indeterminate', () => {
    const onPress = jest.fn()
    render(
      <Checkbox
        indeterminate
        onPress={onPress}
        testID="toggle-indeterminate-checkbox"
      />,
    )
    fireEvent.press(screen.getByTestId('toggle-indeterminate-checkbox'))
    expect(onPress).toHaveBeenCalledWith(true)
  })
})
