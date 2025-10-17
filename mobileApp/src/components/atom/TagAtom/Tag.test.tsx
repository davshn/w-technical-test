import { fireEvent, render, screen } from '@testing-library/react-native'

import { Tag } from '../../atom'
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
    render(<Tag label="Test" testID="tag" />)
    expect(screen.getByTestId('tag')).toBeTruthy()
  })

  it('should render with default props', () => {
    render(<Tag label="Default Tag" testID="default-tag" />)
    const tag = screen.getByTestId('default-tag')
    expect(screen.getByText('Default Tag')).toBeTruthy()
    expect(tag.props.style.paddingVertical).toBe(6)
  })

  it('should render label text', () => {
    render(<Tag label="My Label" testID="label-tag" />)
    expect(screen.getByText('My Label')).toBeTruthy()
  })

  it('should render with custom testID', () => {
    render(<Tag label="Test" testID="custom-tag" />)
    expect(screen.getByTestId('custom-tag')).toBeTruthy()
  })
})

describe('Size Variants', () => {
  it('should render with xs size', () => {
    render(<Tag size="xs" label="XS" testID="xs-tag" />)
    const tag = screen.getByTestId('xs-tag')
    expect(tag.props.style.paddingVertical).toBe(2)
    expect(tag.props.style.paddingHorizontal).toBe(6)
  })

  it('should render with sm size', () => {
    render(<Tag size="sm" label="SM" testID="sm-tag" />)
    const tag = screen.getByTestId('sm-tag')
    expect(tag.props.style.paddingVertical).toBe(4)
    expect(tag.props.style.paddingHorizontal).toBe(8)
  })

  it('should render with base size', () => {
    render(<Tag size="base" label="Base" testID="base-tag" />)
    const tag = screen.getByTestId('base-tag')
    expect(tag.props.style.paddingVertical).toBe(6)
    expect(tag.props.style.paddingHorizontal).toBe(12)
  })

  it('should render with lg size', () => {
    render(<Tag size="lg" label="LG" testID="lg-tag" />)
    const tag = screen.getByTestId('lg-tag')
    expect(tag.props.style.paddingVertical).toBe(8)
    expect(tag.props.style.paddingHorizontal).toBe(16)
  })
})

describe('Variant Styles', () => {
  it('should render with default variant', () => {
    render(<Tag variant="default" label="Default" testID="default-tag" />)
    const tag = screen.getByTestId('default-tag')
    expect(tag.props.style.backgroundColor).toBe(Colors.light.background)
  })

  it('should render with primary variant', () => {
    render(<Tag variant="primary" label="Primary" testID="primary-tag" />)
    const tag = screen.getByTestId('primary-tag')
    expect(tag.props.style.backgroundColor).toBe(Colors.light.primary)
  })

  it('should render with secondary variant', () => {
    render(<Tag variant="secondary" label="Secondary" testID="secondary-tag" />)
    const tag = screen.getByTestId('secondary-tag')
    expect(tag.props.style.backgroundColor).toBe(Colors.light.secondary)
  })

  it('should render with success variant', () => {
    render(<Tag variant="success" label="Success" testID="success-tag" />)
    const tag = screen.getByTestId('success-tag')
    expect(tag.props.style.backgroundColor).toBe(Colors.light.success)
  })

  it('should render with warning variant', () => {
    render(<Tag variant="warning" label="Warning" testID="warning-tag" />)
    const tag = screen.getByTestId('warning-tag')
    expect(tag.props.style.backgroundColor).toBe(Colors.light.warning)
  })

  it('should render with error variant', () => {
    render(<Tag variant="error" label="Error" testID="error-tag" />)
    const tag = screen.getByTestId('error-tag')
    expect(tag.props.style.backgroundColor).toBe(Colors.light.error)
  })

  it('should render with info variant', () => {
    render(<Tag variant="info" label="Info" testID="info-tag" />)
    const tag = screen.getByTestId('info-tag')
    expect(tag.props.style.backgroundColor).toBe(Colors.light.tint)
  })

  it('should render with outline variant', () => {
    render(<Tag variant="outline" label="Outline" testID="outline-tag" />)
    const tag = screen.getByTestId('outline-tag')
    expect(tag.props.style.backgroundColor).toBe('transparent')
    expect(tag.props.style.borderWidth).toBe(1)
    expect(tag.props.style.borderColor).toBe(Colors.light.primary)
  })
})

describe('Shape Variants', () => {
  it('should render with rounded shape', () => {
    render(<Tag shape="rounded" label="Rounded" testID="rounded-tag" />)
    const tag = screen.getByTestId('rounded-tag')
    expect(tag.props.style.borderRadius).toBe(6)
  })

  it('should render with pill shape', () => {
    render(<Tag shape="pill" label="Pill" testID="pill-tag" />)
    const tag = screen.getByTestId('pill-tag')
    expect(tag.props.style.borderRadius).toBe(9999)
  })

  it('should render with square shape', () => {
    render(<Tag shape="square" label="Square" testID="square-tag" />)
    const tag = screen.getByTestId('square-tag')
    expect(tag.props.style.borderRadius).toBe(0)
  })
})

describe('Tag States', () => {
  it('should render in default state', () => {
    render(<Tag label="Default" testID="default-state-tag" />)
    const tag = screen.getByTestId('default-state-tag')
    expect(tag.props.style.opacity).toBeUndefined()
  })

  it('should render in disabled state', () => {
    render(<Tag disabled label="Disabled" testID="disabled-tag" />)
    const tag = screen.getByTestId('disabled-tag')
    expect(tag.props.style.opacity).toBe(0.5)
  })

  it('should apply disabled opacity', () => {
    render(<Tag disabled label="Disabled" testID="disabled-opacity-tag" />)
    const tag = screen.getByTestId('disabled-opacity-tag')
    expect(tag.props.style.opacity).toBe(0.5)
  })
})

describe('Icons', () => {
  const MockIcon = () => null

  it('should render with icon', () => {
    render(<Tag icon={<MockIcon />} label="With Icon" testID="icon-tag" />)
    expect(screen.getByTestId('icon-tag')).toBeTruthy()
    expect(screen.getByText('With Icon')).toBeTruthy()
  })

  it('should render with close icon', () => {
    const onClose = jest.fn()
    render(<Tag onClose={onClose} label="Closeable" testID="close-tag" />)
    expect(screen.getByTestId('close-tag-close')).toBeTruthy()
  })

  it('should render with custom close icon', () => {
    const onClose = jest.fn()
    const CustomCloseIcon = () => null
    render(
      <Tag
        onClose={onClose}
        closeIcon={<CustomCloseIcon />}
        label="Custom Close"
        testID="custom-close-tag"
      />,
    )
    expect(screen.getByTestId('custom-close-tag-close')).toBeTruthy()
  })

  it('should render with both icon and close button', () => {
    const onClose = jest.fn()
    render(
      <Tag
        icon={<MockIcon />}
        onClose={onClose}
        label="Both Icons"
        testID="both-icons-tag"
      />,
    )
    expect(screen.getByTestId('both-icons-tag')).toBeTruthy()
    expect(screen.getByTestId('both-icons-tag-close')).toBeTruthy()
  })
})

describe('Interaction Handling', () => {
  it('should handle onPress event when pressable', () => {
    const onPress = jest.fn()
    render(
      <Tag pressable onPress={onPress} label="Press Me" testID="press-tag" />,
    )
    fireEvent.press(screen.getByTestId('press-tag'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should handle onPress event with onPress prop', () => {
    const onPress = jest.fn()
    render(<Tag onPress={onPress} label="Press Me" testID="onpress-tag" />)
    fireEvent.press(screen.getByTestId('onpress-tag'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should handle onClose event', () => {
    const onClose = jest.fn()
    render(<Tag onClose={onClose} label="Close Me" testID="close-tag" />)
    fireEvent.press(screen.getByTestId('close-tag-close'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should not trigger onPress when disabled', () => {
    const onPress = jest.fn()
    render(
      <Tag
        pressable
        onPress={onPress}
        disabled
        label="Disabled"
        testID="disabled-press-tag"
      />,
    )
    fireEvent.press(screen.getByTestId('disabled-press-tag'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('should not trigger onClose when disabled', () => {
    const onClose = jest.fn()
    render(
      <Tag
        onClose={onClose}
        disabled
        label="Disabled Close"
        testID="disabled-close-tag"
      />,
    )
    fireEvent.press(screen.getByTestId('disabled-close-tag-close'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('should render as View when not interactive', () => {
    render(<Tag label="Static" testID="static-tag" />)
    const tag = screen.getByTestId('static-tag')
    expect(tag.type).toBe('View')
  })

  it('should render as Pressable when pressable', () => {
    const onPress = jest.fn()
    render(
      <Tag
        pressable
        onPress={onPress}
        label="Pressable"
        testID="pressable-tag"
      />,
    )
    const tag = screen.getByTestId('pressable-tag')
    expect(tag.type).toBe('View')
  })
})

describe('Pressed State', () => {
  it('should apply pressed styles when pressed and not disabled', () => {
    const onPress = jest.fn()
    render(
      <Tag pressable onPress={onPress} label="Press Me" testID="pressed-tag" />,
    )
    const tag = screen.getByTestId('pressed-tag')
    expect(tag.props.accessibilityRole).toBe('button')
  })
})

describe('Responsive Behavior', () => {
  it('should render with responsive sizing', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: false,
    })
    render(<Tag responsive label="Responsive" testID="responsive-tag" />)
    const tag = screen.getByTestId('responsive-tag')
    expect(tag.props.style.paddingVertical).toBe(6)
  })

  it('should apply mobile adjustments for small phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(<Tag responsive label="Small" testID="small-phone-tag" />)
    const tag = screen.getByTestId('small-phone-tag')
    expect(tag.props.style.paddingVertical).toBeLessThan(6)
  })

  it('should apply mobile adjustments for large phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: true,
    })

    render(<Tag responsive label="Large" testID="large-phone-tag" />)
    const tag = screen.getByTestId('large-phone-tag')
    expect(tag.props.style.paddingVertical).toBeGreaterThan(6)
  })

  it('should not apply responsive adjustments when responsive is false', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <Tag
        responsive={false}
        label="Non Responsive"
        testID="non-responsive-tag"
      />,
    )
    const tag = screen.getByTestId('non-responsive-tag')
    expect(tag.props.style.paddingVertical).toBe(6)
  })
})

describe('Accessibility', () => {
  it('should have correct accessibility role for non-interactive tag', () => {
    render(<Tag label="Static" testID="accessible-tag" />)
    const tag = screen.getByTestId('accessible-tag')
    expect(tag.props.accessibilityRole).toBe('text')
  })

  it('should have correct accessibility role for interactive tag', () => {
    const onPress = jest.fn()
    render(
      <Tag
        pressable
        onPress={onPress}
        label="Button"
        testID="button-accessible-tag"
      />,
    )
    const tag = screen.getByTestId('button-accessible-tag')
    expect(tag.props.accessibilityRole).toBe('button')
  })

  it('should use label as accessibility label', () => {
    render(<Tag label="My Tag" testID="label-accessible-tag" />)
    const tag = screen.getByTestId('label-accessible-tag')
    expect(tag.props.accessibilityLabel).toBe('My Tag')
  })

  it('should indicate disabled state in accessibility', () => {
    const onPress = jest.fn()
    render(
      <Tag
        pressable
        onPress={onPress}
        disabled
        label="Disabled"
        testID="disabled-accessible-tag"
      />,
    )
    const tag = screen.getByTestId('disabled-accessible-tag')
    expect(tag.props.accessibilityState.disabled).toBe(true)
  })

  it('should be accessible', () => {
    render(<Tag label="Accessible" testID="is-accessible-tag" />)
    const tag = screen.getByTestId('is-accessible-tag')
    expect(tag.props.accessible).toBe(true)
  })
})

describe('Custom Styles', () => {
  it('should accept custom container styles', () => {
    const customStyle = { marginTop: 20 }
    render(<Tag label="Styled" style={customStyle} testID="custom-style-tag" />)
    const tag = screen.getByTestId('custom-style-tag')
    expect(tag.props.style.marginTop).toBe(20)
  })

  it('should accept custom text styles', () => {
    const customTextStyle = { fontWeight: '700' } as any
    render(
      <Tag
        label="Bold Text"
        textStyle={customTextStyle}
        testID="custom-text-tag"
      />,
    )
    expect(screen.getByText('Bold Text')).toBeTruthy()
  })

  it('should merge custom styles with default styles', () => {
    const customStyle = { marginLeft: 10, marginRight: 10 }
    render(<Tag label="Merged" style={customStyle} testID="merged-style-tag" />)
    const tag = screen.getByTestId('merged-style-tag')
    expect(tag.props.style.marginLeft).toBe(10)
    expect(tag.props.style.marginRight).toBe(10)
    expect(tag.props.style.paddingVertical).toBe(6)
  })
})

describe('Text Colors', () => {
  it('should have correct text color for default variant', () => {
    render(<Tag variant="default" label="Default" testID="default-text-tag" />)
    const text = screen.getByText('Default')
    expect(text.props.style.color).toBe(Colors.light.textSecondary)
  })

  it('should have white text for primary variant', () => {
    render(<Tag variant="primary" label="Primary" testID="primary-text-tag" />)
    const text = screen.getByText('Primary')
    expect(text.props.style.color).toBe(Colors.light.white)
  })

  it('should have white text for success variant', () => {
    render(<Tag variant="success" label="Success" testID="success-text-tag" />)
    const text = screen.getByText('Success')
    expect(text.props.style.color).toBe(Colors.light.white)
  })

  it('should have correct text color for outline variant', () => {
    render(<Tag variant="outline" label="Outline" testID="outline-text-tag" />)
    const text = screen.getByText('Outline')
    expect(text.props.style.color).toBe(Colors.light.textPrimary)
  })
})

describe('Label Truncation', () => {
  it('should truncate label with numberOfLines=1', () => {
    render(
      <Tag
        label="This is a very long label that should truncate"
        testID="truncate-tag"
      />,
    )
    const text = screen.getByText(
      'This is a very long label that should truncate',
    )
    expect(text.props.numberOfLines).toBe(1)
  })
})

describe('Close Button Hit Slop', () => {
  it('should have hit slop on close button for better touch target', () => {
    const onClose = jest.fn()
    render(<Tag onClose={onClose} label="Close" testID="hitslop-tag" />)
    const closeButton = screen.getByTestId('hitslop-tag-close')
    expect(closeButton.props.hitSlop).toBe(8)
  })
})
