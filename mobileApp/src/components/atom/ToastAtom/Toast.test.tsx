import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native'

import { ToastBase } from '../../atom'
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

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native')
  RN.Animated.timing = () => ({
    start: (callback?: () => void) => {
      callback?.()
    },
  })
  RN.Animated.spring = () => ({
    start: (callback?: () => void) => {
      callback?.()
    },
  })
  RN.Animated.parallel = (animations: any[]) => ({
    start: (callback?: () => void) => {
      callback?.()
    },
  })
  return RN
})

describe('Rendering', () => {
  it('should render without crashing when visible', () => {
    render(<ToastBase visible message="Test" testID="ToastBase" />)
    expect(screen.getByTestId('ToastBase')).toBeTruthy()
  })

  it('should not render when not visible', () => {
    render(<ToastBase visible={false} message="Test" testID="ToastBase" />)
    expect(screen.queryByTestId('ToastBase')).toBeNull()
  })

  it('should render message text', () => {
    render(<ToastBase visible message="Hello World" testID="ToastBase" />)
    expect(screen.getByText('Hello World')).toBeTruthy()
  })

  it('should render with default props', () => {
    render(
      <ToastBase
        visible
        message="Default ToastBase"
        testID="default-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('default-ToastBase')
    expect(screen.getByText('Default ToastBase')).toBeTruthy()
    expect(Toast.props.style.paddingVertical).toBe(12)
  })

  it('should render with custom testID', () => {
    render(<ToastBase visible message="Test" testID="custom-ToastBase" />)
    expect(screen.getByTestId('custom-ToastBase')).toBeTruthy()
  })
})

describe('Size Variants', () => {
  it('should render with sm size', () => {
    render(<ToastBase visible size="sm" message="SM" testID="sm-ToastBase" />)
    const Toast = screen.getByTestId('sm-ToastBase')
    expect(Toast.props.style.paddingVertical).toBe(8)
    expect(Toast.props.style.paddingHorizontal).toBe(12)
  })

  it('should render with base size', () => {
    render(
      <ToastBase visible size="base" message="Base" testID="base-ToastBase" />,
    )
    const Toast = screen.getByTestId('base-ToastBase')
    expect(Toast.props.style.paddingVertical).toBe(12)
    expect(Toast.props.style.paddingHorizontal).toBe(16)
  })

  it('should render with lg size', () => {
    render(<ToastBase visible size="lg" message="LG" testID="lg-ToastBase" />)
    const Toast = screen.getByTestId('lg-ToastBase')
    expect(Toast.props.style.paddingVertical).toBe(16)
    expect(Toast.props.style.paddingHorizontal).toBe(20)
  })
})

describe('Variant Styles', () => {
  it('should render with default variant', () => {
    render(
      <ToastBase
        visible
        variant="default"
        message="Default"
        testID="default-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('default-ToastBase')
    expect(Toast.props.style.backgroundColor).toBe(Colors.light.background)
  })

  it('should render with success variant', () => {
    render(
      <ToastBase
        visible
        variant="success"
        message="Success"
        testID="success-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('success-ToastBase')
    expect(Toast.props.style.backgroundColor).toBe(Colors.light.success)
  })

  it('should render with error variant', () => {
    render(
      <ToastBase
        visible
        variant="error"
        message="Error"
        testID="error-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('error-ToastBase')
    expect(Toast.props.style.backgroundColor).toBe(Colors.light.error)
  })

  it('should render with warning variant', () => {
    render(
      <ToastBase
        visible
        variant="warning"
        message="Warning"
        testID="warning-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('warning-ToastBase')
    expect(Toast.props.style.backgroundColor).toBe(Colors.light.warning)
  })

  it('should render with info variant', () => {
    render(
      <ToastBase
        visible
        variant="info"
        message="Info"
        testID="info-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('info-ToastBase')
    expect(Toast.props.style.backgroundColor).toBe(Colors.light.primary)
  })
})

describe('Position Variants', () => {
  it('should render at top position', () => {
    const container = render(
      <ToastBase visible position="top" message="Top" testID="top-ToastBase" />,
    )
    expect(screen.getByTestId('top-ToastBase')).toBeTruthy()
  })

  it('should render at bottom position', () => {
    const container = render(
      <ToastBase
        visible
        position="bottom"
        message="Bottom"
        testID="bottom-ToastBase"
      />,
    )
    expect(screen.getByTestId('bottom-ToastBase')).toBeTruthy()
  })

  it('should render at center position', () => {
    const container = render(
      <ToastBase
        visible
        position="center"
        message="Center"
        testID="center-ToastBase"
      />,
    )
    expect(screen.getByTestId('center-ToastBase')).toBeTruthy()
  })
})

describe('Icons', () => {
  const MockIcon = () => null

  it('should render with icon', () => {
    render(
      <ToastBase
        visible
        icon={<MockIcon />}
        message="With Icon"
        testID="icon-ToastBase"
      />,
    )
    expect(screen.getByTestId('icon-ToastBase')).toBeTruthy()
    expect(screen.getByText('With Icon')).toBeTruthy()
  })

  it('should render with close button when showCloseButton is true', () => {
    render(
      <ToastBase
        visible
        showCloseButton
        message="Closeable"
        testID="close-ToastBase"
      />,
    )
    expect(screen.getByTestId('close-ToastBase-close')).toBeTruthy()
  })

  it('should render with custom close icon', () => {
    const CustomCloseIcon = () => null
    render(
      <ToastBase
        visible
        showCloseButton
        closeIcon={<CustomCloseIcon />}
        message="Custom Close"
        testID="custom-close-ToastBase"
      />,
    )
    expect(screen.getByTestId('custom-close-ToastBase-close')).toBeTruthy()
  })

  it('should render with both icon and close button', () => {
    render(
      <ToastBase
        visible
        icon={<MockIcon />}
        showCloseButton
        message="Both Icons"
        testID="both-icons-ToastBase"
      />,
    )
    expect(screen.getByTestId('both-icons-ToastBase')).toBeTruthy()
    expect(screen.getByTestId('both-icons-ToastBase-close')).toBeTruthy()
  })

  it('should not render close button when showCloseButton is false', () => {
    render(
      <ToastBase
        visible
        showCloseButton={false}
        message="No Close"
        testID="no-close-ToastBase"
      />,
    )
    expect(screen.queryByTestId('no-close-ToastBase-close')).toBeNull()
  })
})

describe('Interaction Handling', () => {
  it('should handle onPress event', () => {
    const onPress = jest.fn()
    render(
      <ToastBase
        visible
        onPress={onPress}
        message="Press Me"
        testID="press-ToastBase"
      />,
    )
    const pressable = screen.getByTestId('press-ToastBase').parent
    fireEvent.press(pressable!)
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should handle close button press', () => {
    const onHide = jest.fn()
    render(
      <ToastBase
        visible
        showCloseButton
        onHide={onHide}
        message="Close Me"
        testID="close-press-ToastBase"
        duration={0}
      />,
    )
    fireEvent.press(screen.getByTestId('close-press-ToastBase-close'))

    waitFor(() => {
      expect(onHide).toHaveBeenCalled()
    })
  })
})

describe('Auto Hide Behavior', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should auto hide after duration', () => {
    const onHide = jest.fn()
    render(
      <ToastBase
        visible
        duration={3000}
        onHide={onHide}
        message="Auto Hide"
        testID="auto-hide-ToastBase"
      />,
    )

    jest.advanceTimersByTime(3000)

    waitFor(() => {
      expect(onHide).toHaveBeenCalled()
    })
  })

  it('should not auto hide when duration is 0', () => {
    const onHide = jest.fn()
    render(
      <ToastBase
        visible
        duration={0}
        onHide={onHide}
        message="No Auto Hide"
        testID="no-auto-hide-ToastBase"
      />,
    )

    jest.advanceTimersByTime(5000)

    expect(onHide).not.toHaveBeenCalled()
  })

  it('should not auto hide when duration is negative', () => {
    const onHide = jest.fn()
    render(
      <ToastBase
        visible
        duration={-1}
        onHide={onHide}
        message="Persistent"
        testID="persistent-ToastBase"
      />,
    )

    jest.advanceTimersByTime(5000)

    expect(onHide).not.toHaveBeenCalled()
  })
})

describe('Responsive Behavior', () => {
  it('should render with responsive sizing', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: false,
    })
    render(
      <ToastBase
        visible
        responsive
        message="Responsive"
        testID="responsive-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('responsive-ToastBase')
    expect(Toast.props.style.paddingVertical).toBe(12)
  })

  it('should apply mobile adjustments for small phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <ToastBase
        visible
        responsive
        message="Small"
        testID="small-phone-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('small-phone-ToastBase')
    expect(Toast.props.style.paddingVertical).toBeLessThan(12)
  })

  it('should apply mobile adjustments for large phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: true,
    })

    render(
      <ToastBase
        visible
        responsive
        message="Large"
        testID="large-phone-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('large-phone-ToastBase')
    expect(Toast.props.style.paddingVertical).toBeGreaterThan(12)
  })

  it('should not apply responsive adjustments when responsive is false', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <ToastBase
        visible
        responsive={false}
        message="Non Responsive"
        testID="non-responsive-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('non-responsive-ToastBase')
    expect(Toast.props.style.paddingVertical).toBe(12)
  })
})

describe('Custom Styles', () => {
  it('should accept custom container styles', () => {
    const customStyle = { marginTop: 20 }
    render(
      <ToastBase
        visible
        message="Styled"
        style={customStyle}
        testID="custom-style-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('custom-style-ToastBase')
    expect(Toast.props.style.marginTop).toBe(20)
  })

  it('should merge custom styles with default styles', () => {
    const customStyle = { marginLeft: 10, marginRight: 10 }
    render(
      <ToastBase
        visible
        message="Merged"
        style={customStyle}
        testID="merged-style-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('merged-style-ToastBase')
    expect(Toast.props.style.marginLeft).toBe(10)
    expect(Toast.props.style.marginRight).toBe(10)
    expect(Toast.props.style.paddingVertical).toBe(12)
  })
})

describe('Text Colors', () => {
  it('should have correct text color for default variant', () => {
    render(
      <ToastBase
        visible
        variant="default"
        message="Default"
        testID="default-text-ToastBase"
      />,
    )
    const text = screen.getByText('Default')
    expect(text.props.style.color).toBe(Colors.light.textSecondary)
  })

  it('should have white text for success variant', () => {
    render(
      <ToastBase
        visible
        variant="success"
        message="Success"
        testID="success-text-ToastBase"
      />,
    )
    const text = screen.getByText('Success')
    expect(text.props.style.color).toBe(Colors.light.white)
  })

  it('should have white text for error variant', () => {
    render(
      <ToastBase
        visible
        variant="error"
        message="Error"
        testID="error-text-ToastBase"
      />,
    )
    const text = screen.getByText('Error')
    expect(text.props.style.color).toBe(Colors.light.white)
  })

  it('should have white text for warning variant', () => {
    render(
      <ToastBase
        visible
        variant="warning"
        message="Warning"
        testID="warning-text-ToastBase"
      />,
    )
    const text = screen.getByText('Warning')
    expect(text.props.style.color).toBe(Colors.light.white)
  })

  it('should have white text for info variant', () => {
    render(
      <ToastBase
        visible
        variant="info"
        message="Info"
        testID="info-text-ToastBase"
      />,
    )
    const text = screen.getByText('Info')
    expect(text.props.style.color).toBe(Colors.light.white)
  })
})

describe('Message Truncation', () => {
  it('should truncate message with numberOfLines=3', () => {
    render(
      <ToastBase
        visible
        message="This is a very long message that should be truncated after three lines to maintain a good user experience"
        testID="truncate-ToastBase"
      />,
    )
    const text = screen.getByText(
      'This is a very long message that should be truncated after three lines to maintain a good user experience',
    )
    expect(text.props.numberOfLines).toBe(3)
  })
})

describe('Close Button Hit Slop', () => {
  it('should have hit slop on close button for better touch target', () => {
    render(
      <ToastBase
        visible
        showCloseButton
        message="Close"
        testID="hitslop-ToastBase"
      />,
    )
    const closeButton = screen.getByTestId('hitslop-ToastBase-close')
    expect(closeButton.props.hitSlop).toBe(8)
  })
})

describe('Shadow and Elevation', () => {
  it('should have shadow properties', () => {
    render(<ToastBase visible message="Shadow" testID="shadow-ToastBase" />)
    const Toast = screen.getByTestId('shadow-ToastBase')
    expect(Toast.props.style.shadowColor).toBe('#000')
    expect(Toast.props.style.shadowOpacity).toBe(0.3)
    expect(Toast.props.style.shadowRadius).toBe(8)
    expect(Toast.props.style.elevation).toBe(8)
  })
})

describe('Border Radius', () => {
  it('should have default border radius', () => {
    render(<ToastBase visible message="Rounded" testID="rounded-ToastBase" />)
    const Toast = screen.getByTestId('rounded-ToastBase')
    expect(Toast.props.style.borderRadius).toBe(12)
  })
})

describe('Max Width', () => {
  it('should have max width of 90%', () => {
    render(
      <ToastBase visible message="Max Width" testID="maxwidth-ToastBase" />,
    )
    const Toast = screen.getByTestId('maxwidth-ToastBase')
    expect(Toast.props.style.maxWidth).toBe('90%')
  })
})

describe('Visibility Toggle', () => {
  it('should hide when visible changes from true to false', () => {
    const { rerender } = render(
      <ToastBase visible message="Toggle" testID="toggle-ToastBase" />,
    )
    expect(screen.getByTestId('toggle-ToastBase')).toBeTruthy()

    rerender(
      <ToastBase visible={false} message="Toggle" testID="toggle-ToastBase" />,
    )
    expect(screen.queryByTestId('toggle-ToastBase')).toBeNull()
  })

  it('should show when visible changes from false to true', () => {
    const { rerender } = render(
      <ToastBase visible={false} message="Toggle" testID="toggle-ToastBase" />,
    )
    expect(screen.queryByTestId('toggle-ToastBase')).toBeNull()

    rerender(<ToastBase visible message="Toggle" testID="toggle-ToastBase" />)
    expect(screen.getByTestId('toggle-ToastBase')).toBeTruthy()
  })
})

describe('Layout Properties', () => {
  it('should have flexDirection row', () => {
    render(<ToastBase visible message="Flex" testID="flex-ToastBase" />)
    const Toast = screen.getByTestId('flex-ToastBase')
    expect(Toast.props.style.flexDirection).toBe('row')
  })

  it('should have alignItems center', () => {
    render(<ToastBase visible message="Align" testID="align-ToastBase" />)
    const Toast = screen.getByTestId('align-ToastBase')
    expect(Toast.props.style.alignItems).toBe('center')
  })

  it('should have minHeight based on size', () => {
    render(
      <ToastBase
        visible
        size="base"
        message="Height"
        testID="height-ToastBase"
      />,
    )
    const Toast = screen.getByTestId('height-ToastBase')
    expect(Toast.props.style.minHeight).toBe(48)
  })
})
