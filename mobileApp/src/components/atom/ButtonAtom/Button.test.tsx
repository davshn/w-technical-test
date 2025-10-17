import { fireEvent, render, screen } from '@testing-library/react-native'

import { Button, FAB, IconButton, LinkButton } from '../../atom'
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
    render(<Button title="Test" testID="button" />)
    expect(screen.getByTestId('button')).toBeTruthy()
  })

  it('should render with default props', () => {
    render(<Button title="Click Me" testID="default-button" />)
    const button = screen.getByTestId('default-button')
    expect(button.props.style.height).toBe(40)
  })

  it('should render with custom testID', () => {
    render(<Button title="Test" testID="custom-button" />)
    expect(screen.getByTestId('custom-button')).toBeTruthy()
  })
})

describe('Size Variants', () => {
  it('should render with xs size', () => {
    render(<Button size="xs" title="XS" testID="xs-button" />)
    const button = screen.getByTestId('xs-button')
    expect(button.props.style.height).toBe(28)
  })

  it('should render with sm size', () => {
    render(<Button size="sm" title="SM" testID="sm-button" />)
    const button = screen.getByTestId('sm-button')
    expect(button.props.style.height).toBe(32)
  })

  it('should render with base size', () => {
    render(<Button size="base" title="Base" testID="base-button" />)
    const button = screen.getByTestId('base-button')
    expect(button.props.style.height).toBe(40)
  })

  it('should render with lg size', () => {
    render(<Button size="lg" title="LG" testID="lg-button" />)
    const button = screen.getByTestId('lg-button')
    expect(button.props.style.height).toBe(48)
  })

  it('should render with xl size', () => {
    render(<Button size="xl" title="XL" testID="xl-button" />)
    const button = screen.getByTestId('xl-button')
    expect(button.props.style.height).toBe(56)
  })
})

describe('Variant Styles', () => {
  it('should render with primary variant', () => {
    render(<Button variant="primary" title="Primary" testID="primary-button" />)
    const button = screen.getByTestId('primary-button')
    expect(button.props.style.backgroundColor).toBe(Colors.light.primary)
  })

  it('should render with secondary variant', () => {
    render(
      <Button
        variant="secondary"
        title="Secondary"
        testID="secondary-button"
      />,
    )
    const button = screen.getByTestId('secondary-button')
    expect(button.props.style.backgroundColor).toBe(Colors.light.secondary)
  })

  it('should render with outline variant', () => {
    render(<Button variant="outline" title="Outline" testID="outline-button" />)
    const button = screen.getByTestId('outline-button')
    expect(button.props.style.backgroundColor).toBe('transparent')
  })

  it('should render with ghost variant', () => {
    render(<Button variant="ghost" title="Ghost" testID="ghost-button" />)
    const button = screen.getByTestId('ghost-button')
    expect(button.props.style.backgroundColor).toBe('transparent')
  })

  it('should render with link variant', () => {
    render(<Button variant="link" title="Link" testID="link-button" />)
    const button = screen.getByTestId('link-button')
    expect(button.props.style.borderWidth).toBeFalsy()
  })

  it('should render with success variant', () => {
    render(<Button variant="success" title="Success" testID="success-button" />)
    const button = screen.getByTestId('success-button')
    expect(button.props.style.backgroundColor).toBe(Colors.light.success)
  })

  it('should render with warning variant', () => {
    render(<Button variant="warning" title="Warning" testID="warning-button" />)
    const button = screen.getByTestId('warning-button')
    expect(button.props.style.backgroundColor).toBe(Colors.light.warning)
  })

  it('should render with error variant', () => {
    render(<Button variant="error" title="Error" testID="error-button" />)
    const button = screen.getByTestId('error-button')
    expect(button.props.style.backgroundColor).toBe(Colors.light.error)
  })

  it('should render with fab variant', () => {
    const MockIcon = () => null
    render(<Button variant="fab" icon={<MockIcon />} testID="fab-button" />)
    const button = screen.getByTestId('fab-button')
    expect(button.props.style.elevation).toBe(6)
  })

  it('should render with icon variant', () => {
    const MockIcon = () => null
    render(<Button variant="icon" icon={<MockIcon />} testID="icon-button" />)
    const button = screen.getByTestId('icon-button')
    expect(button.props.style.width).toBe(40)
  })
})

describe('Shape Variants', () => {
  it('should render with rounded shape', () => {
    render(<Button shape="rounded" title="Rounded" testID="rounded-button" />)
    const button = screen.getByTestId('rounded-button')
    expect(button.props.style.borderRadius).toBe(8)
  })

  it('should render with square shape', () => {
    render(<Button shape="square" title="Square" testID="square-button" />)
    const button = screen.getByTestId('square-button')
    expect(button.props.style.borderRadius).toBe(0)
  })

  it('should render with circle shape for icon button', () => {
    const MockIcon = () => null
    render(
      <Button
        variant="icon"
        shape="circle"
        icon={<MockIcon />}
        testID="circle-button"
      />,
    )
    const button = screen.getByTestId('circle-button')
    expect(button.props.style.borderRadius).toBe(22)
  })
})

describe('Button States', () => {
  it('should render in default state', () => {
    render(
      <Button state="default" title="Default" testID="default-state-button" />,
    )
    const button = screen.getByTestId('default-state-button')
    expect(button.props.accessibilityState.disabled).toBe(false)
  })

  it('should render in disabled state', () => {
    render(<Button disabled title="Disabled" testID="disabled-button" />)
    const button = screen.getByTestId('disabled-button')
    expect(button.props.accessibilityState.disabled).toBe(true)
  })

  it('should render in loading state', () => {
    render(<Button loading title="Loading" testID="loading-button" />)
    const button = screen.getByTestId('loading-button')
    expect(button.props.accessibilityState.busy).toBe(true)
  })
})

describe('Icons', () => {
  const MockIcon = () => null

  it('should render with left icon', () => {
    render(
      <Button
        leftIcon={<MockIcon />}
        title="With Icon"
        testID="left-icon-button"
      />,
    )
    const button = screen.getByTestId('left-icon-button')
    expect(button.props.children[0].props.children[0]).toBeTruthy()
  })

  it('should render with right icon', () => {
    render(
      <Button
        rightIcon={<MockIcon />}
        title="With Icon"
        testID="right-icon-button"
      />,
    )
    const button = screen.getByTestId('right-icon-button')
    expect(button.props.children[0].props.children[3]).toBeTruthy()
  })

  it('should render with both left and right icons', () => {
    render(
      <Button
        leftIcon={<MockIcon />}
        rightIcon={<MockIcon />}
        title="Both Icons"
        testID="both-icons-button"
      />,
    )
    const button = screen.getByTestId('both-icons-button')
    expect(button.props.children[0].props.children[0]).toBeTruthy()
    expect(button.props.children[0].props.children[3]).toBeTruthy()
  })
})

describe('Loading State', () => {
  it('should show loading spinner when loading', () => {
    render(<Button loading title="Submit" testID="loading-spinner-button" />)
    const button = screen.getByTestId('loading-spinner-button')
    expect(button.props.children[0].props.children[0].type.displayName).toBe(
      'ActivityIndicator',
    )
  })

  it('should show custom loading text', () => {
    render(
      <Button
        loading
        loadingText="Processing..."
        title="Submit"
        testID="loading-text-button"
      />,
    )
    expect(screen.getByText('Processing...')).toBeTruthy()
  })

  it('should show custom loading icon', () => {
    const CustomLoader = () => null
    render(
      <Button
        loading
        loadingIcon={<CustomLoader />}
        title="Submit"
        testID="custom-loader-button"
      />,
    )
    const button = screen.getByTestId('custom-loader-button')
    expect(button.props.children[0].props.children[0].type.name).toBe(
      'CustomLoader',
    )
  })
})

describe('Interaction Handling', () => {
  it('should handle onPress event', () => {
    const onPress = jest.fn()
    render(<Button title="Press Me" onPress={onPress} testID="press-button" />)
    fireEvent.press(screen.getByTestId('press-button'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should handle onLongPress event', () => {
    const onLongPress = jest.fn()
    render(
      <Button
        title="Long Press"
        onLongPress={onLongPress}
        testID="long-press-button"
      />,
    )
    fireEvent(screen.getByTestId('long-press-button'), 'longPress')
    expect(onLongPress).toHaveBeenCalledTimes(1)
  })

  it('should not trigger onPress when disabled', () => {
    const onPress = jest.fn()
    render(
      <Button
        title="Disabled"
        onPress={onPress}
        disabled
        testID="disabled-press-button"
      />,
    )
    fireEvent.press(screen.getByTestId('disabled-press-button'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('should not trigger onPress when loading', () => {
    const onPress = jest.fn()
    render(
      <Button
        title="Loading"
        onPress={onPress}
        loading
        testID="loading-press-button"
      />,
    )
    fireEvent.press(screen.getByTestId('loading-press-button'))
    expect(onPress).not.toHaveBeenCalled()
  })
})

describe('Responsive Behavior', () => {
  it('should render with responsive sizing', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: false,
    })
    render(<Button responsive title="Responsive" testID="responsive-button" />)
    const button = screen.getByTestId('responsive-button')
    expect(button.props.style.height).toBe(40)
  })

  it('should apply mobile adjustments for small phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(<Button responsive title="Small" testID="small-phone-button" />)
    const button = screen.getByTestId('small-phone-button')
    expect(button.props.style.height).toBeLessThan(40)
  })

  it('should apply mobile adjustments for large phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: true,
    })

    render(<Button responsive title="Large" testID="large-phone-button" />)
    const button = screen.getByTestId('large-phone-button')
    expect(button.props.style.height).toBeGreaterThan(40)
  })
})

describe('Accessibility', () => {
  it('should have correct accessibility role for button', () => {
    render(<Button title="Test" testID="accessible-button" />)
    const button = screen.getByTestId('accessible-button')
    expect(button.props.accessibilityRole).toBe('button')
  })

  it('should have correct accessibility role for link variant', () => {
    render(
      <Button variant="link" title="Link" testID="link-accessible-button" />,
    )
    const button = screen.getByTestId('link-accessible-button')
    expect(button.props.accessibilityRole).toBe('link')
  })

  it('should use title as accessibility label', () => {
    render(<Button title="Submit Form" testID="title-label-button" />)
    const button = screen.getByTestId('title-label-button')
    expect(button.props.accessibilityLabel).toBe('Submit Form')
  })

  it('should use custom accessibility label', () => {
    render(
      <Button
        title="OK"
        accessibilityLabel="Confirm action"
        testID="custom-label-button"
      />,
    )
    const button = screen.getByTestId('custom-label-button')
    expect(button.props.accessibilityLabel).toBe('Confirm action')
  })

  it('should have accessibility hint', () => {
    render(
      <Button
        title="Submit"
        accessibilityHint="Submits the form"
        testID="hint-button"
      />,
    )
    const button = screen.getByTestId('hint-button')
    expect(button.props.accessibilityHint).toBe('Submits the form')
  })

  it('should indicate disabled state in accessibility', () => {
    render(
      <Button title="Disabled" disabled testID="disabled-accessible-button" />,
    )
    const button = screen.getByTestId('disabled-accessible-button')
    expect(button.props.accessibilityState.disabled).toBe(true)
  })

  it('should indicate loading state in accessibility', () => {
    render(
      <Button title="Loading" loading testID="loading-accessible-button" />,
    )
    const button = screen.getByTestId('loading-accessible-button')
    expect(button.props.accessibilityState.busy).toBe(true)
  })
})

describe('Custom Styles', () => {
  it('should accept custom container styles', () => {
    const customStyle = { marginTop: 20 }
    render(
      <Button
        title="Styled"
        style={customStyle}
        testID="custom-style-button"
      />,
    )
    const button = screen.getByTestId('custom-style-button')
    expect(button.props.style.marginTop).toBe(20)
  })

  describe('Component Shortcuts', () => {
    const MockIcon = () => null

    it('should render IconButton component', () => {
      render(<IconButton icon={<MockIcon />} testID="icon-button-shortcut" />)
      expect(screen.getByTestId('icon-button-shortcut')).toBeTruthy()
    })

    it('should render FAB component', () => {
      render(<FAB icon={<MockIcon />} testID="fab-shortcut" />)
      expect(screen.getByTestId('fab-shortcut')).toBeTruthy()
    })

    it('should render LinkButton component', () => {
      render(<LinkButton title="Link" testID="link-button-shortcut" />)
      expect(screen.getByTestId('link-button-shortcut')).toBeTruthy()
    })
  })

  describe('Children Content', () => {
    it('should render with string children', () => {
      render(<Button testID="children-button">Click Me</Button>)
      expect(screen.getByText('Click Me')).toBeTruthy()
    })

    it('should prioritize title over children', () => {
      render(
        <Button title="Title Text" testID="priority-button">
          Child Text
        </Button>,
      )
      expect(screen.getByText('Title Text')).toBeTruthy()
      expect(screen.queryByText('Child Text')).toBeNull()
    })
  })
})
