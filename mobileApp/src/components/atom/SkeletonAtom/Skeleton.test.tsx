import { render, screen } from '@testing-library/react-native'

import { Skeleton } from '../../atom'
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
    stop: jest.fn(),
  })
  RN.Animated.loop = (animation: any) => ({
    start: jest.fn(),
    stop: jest.fn(),
  })
  RN.Animated.sequence = (animations: any[]) => ({
    start: jest.fn(),
    stop: jest.fn(),
  })
  return RN
})

describe('Rendering', () => {
  it('should render without crashing', () => {
    render(<Skeleton testID="skeleton" />)
    expect(screen.getByTestId('skeleton')).toBeTruthy()
  })

  it('should render with default props', () => {
    render(<Skeleton testID="default-skeleton" />)
    const skeleton = screen.getByTestId('default-skeleton')
    expect(skeleton.props.style.width).toBe('100%')
    expect(skeleton.props.style.height).toBe(100)
  })

  it('should render with custom testID', () => {
    render(<Skeleton testID="custom-skeleton" />)
    expect(screen.getByTestId('custom-skeleton')).toBeTruthy()
  })
})

describe('Variant Styles', () => {
  it('should render with rect variant', () => {
    render(<Skeleton variant="rect" testID="rect-skeleton" />)
    const skeleton = screen.getByTestId('rect-skeleton')
    expect(skeleton.props.style.width).toBe('100%')
    expect(skeleton.props.style.height).toBe(100)
    expect(skeleton.props.style.borderRadius).toBe(8)
  })

  it('should render with circle variant', () => {
    render(<Skeleton variant="circle" testID="circle-skeleton" />)
    const skeleton = screen.getByTestId('circle-skeleton')
    expect(skeleton.props.style.width).toBe(40)
    expect(skeleton.props.style.height).toBe(40)
    expect(skeleton.props.style.borderRadius).toBe(9999)
  })

  it('should render with text variant', () => {
    render(<Skeleton variant="text" testID="text-skeleton" />)
    const skeleton = screen.getByTestId('text-skeleton')
    expect(skeleton.props.style.width).toBe('100%')
    expect(skeleton.props.style.height).toBe(16)
    expect(skeleton.props.style.borderRadius).toBe(4)
  })
})

describe('Size Variants', () => {
  it('should render with sm size for text variant', () => {
    render(<Skeleton variant="text" size="sm" testID="sm-text-skeleton" />)
    const skeleton = screen.getByTestId('sm-text-skeleton')
    expect(skeleton.props.style.height).toBe(12)
  })

  it('should render with base size for text variant', () => {
    render(<Skeleton variant="text" size="base" testID="base-text-skeleton" />)
    const skeleton = screen.getByTestId('base-text-skeleton')
    expect(skeleton.props.style.height).toBe(16)
  })

  it('should render with lg size for text variant', () => {
    render(<Skeleton variant="text" size="lg" testID="lg-text-skeleton" />)
    const skeleton = screen.getByTestId('lg-text-skeleton')
    expect(skeleton.props.style.height).toBe(20)
  })

  it('should render with xl size for text variant', () => {
    render(<Skeleton variant="text" size="xl" testID="xl-text-skeleton" />)
    const skeleton = screen.getByTestId('xl-text-skeleton')
    expect(skeleton.props.style.height).toBe(24)
  })
})

describe('Custom Dimensions', () => {
  it('should apply custom width', () => {
    render(<Skeleton width={200} testID="custom-width-skeleton" />)
    const skeleton = screen.getByTestId('custom-width-skeleton')
    expect(skeleton.props.style.width).toBe(200)
  })

  it('should apply custom height', () => {
    render(<Skeleton height={150} testID="custom-height-skeleton" />)
    const skeleton = screen.getByTestId('custom-height-skeleton')
    expect(skeleton.props.style.height).toBe(150)
  })

  it('should apply custom width and height', () => {
    render(
      <Skeleton width={300} height={200} testID="custom-dimensions-skeleton" />,
    )
    const skeleton = screen.getByTestId('custom-dimensions-skeleton')
    expect(skeleton.props.style.width).toBe(300)
    expect(skeleton.props.style.height).toBe(200)
  })

  it('should apply percentage width', () => {
    render(<Skeleton width="50%" testID="percentage-width-skeleton" />)
    const skeleton = screen.getByTestId('percentage-width-skeleton')
    expect(skeleton.props.style.width).toBe('50%')
  })

  it('should apply percentage height', () => {
    render(<Skeleton height="75%" testID="percentage-height-skeleton" />)
    const skeleton = screen.getByTestId('percentage-height-skeleton')
    expect(skeleton.props.style.height).toBe('75%')
  })
})

describe('Circle Variant Dimensions', () => {
  it('should use width for circle dimensions', () => {
    render(
      <Skeleton variant="circle" width={50} testID="circle-width-skeleton" />,
    )
    const skeleton = screen.getByTestId('circle-width-skeleton')
    expect(skeleton.props.style.width).toBe(50)
    expect(skeleton.props.style.height).toBe(50)
  })

  it('should use height for circle dimensions when no width', () => {
    render(
      <Skeleton variant="circle" height={60} testID="circle-height-skeleton" />,
    )
    const skeleton = screen.getByTestId('circle-height-skeleton')
    expect(skeleton.props.style.width).toBe(60)
    expect(skeleton.props.style.height).toBe(60)
  })

  it('should default to 40 for circle when no dimensions', () => {
    render(<Skeleton variant="circle" testID="circle-default-skeleton" />)
    const skeleton = screen.getByTestId('circle-default-skeleton')
    expect(skeleton.props.style.width).toBe(40)
    expect(skeleton.props.style.height).toBe(40)
  })
})

describe('Border Radius', () => {
  it('should apply custom borderRadius', () => {
    render(<Skeleton borderRadius={12} testID="custom-radius-skeleton" />)
    const skeleton = screen.getByTestId('custom-radius-skeleton')
    expect(skeleton.props.style.borderRadius).toBe(12)
  })

  it('should override default radius with custom value', () => {
    render(
      <Skeleton
        variant="circle"
        borderRadius={20}
        testID="override-radius-skeleton"
      />,
    )
    const skeleton = screen.getByTestId('override-radius-skeleton')
    expect(skeleton.props.style.borderRadius).toBe(20)
  })
})

describe('Multiple Lines', () => {
  it('should render single line by default', () => {
    render(<Skeleton variant="text" testID="single-line-skeleton" />)
    expect(screen.getByTestId('single-line-skeleton')).toBeTruthy()
    expect(screen.queryByTestId('single-line-skeleton-line-0')).toBeNull()
  })

  it('should render multiple lines when lines > 1', () => {
    render(<Skeleton variant="text" lines={3} testID="multi-line-skeleton" />)
    expect(screen.getByTestId('multi-line-skeleton-line-0')).toBeTruthy()
    expect(screen.getByTestId('multi-line-skeleton-line-1')).toBeTruthy()
    expect(screen.getByTestId('multi-line-skeleton-line-2')).toBeTruthy()
  })

  it('should apply line spacing between lines', () => {
    render(
      <Skeleton
        variant="text"
        lines={2}
        lineSpacing={12}
        testID="line-spacing-skeleton"
      />,
    )
    const line1 = screen.getByTestId('line-spacing-skeleton-line-1')
    expect(line1.props.style.marginTop).toBe(12)
  })

  it('should not apply margin to first line', () => {
    render(<Skeleton variant="text" lines={2} testID="first-line-skeleton" />)
    const line0 = screen.getByTestId('first-line-skeleton-line-0')
    expect(line0.props.style.marginTop).toBeUndefined()
  })

  it('should apply lastLineWidth to last line', () => {
    render(
      <Skeleton
        variant="text"
        lines={3}
        lastLineWidth="70%"
        testID="last-line-skeleton"
      />,
    )
    const lastLine = screen.getByTestId('last-line-skeleton-line-2')
    expect(lastLine.props.style.width).toBe('70%')
  })

  it('should apply default lastLineWidth of 60%', () => {
    render(
      <Skeleton variant="text" lines={2} testID="default-last-line-skeleton" />,
    )
    const lastLine = screen.getByTestId('default-last-line-skeleton-line-1')
    expect(lastLine.props.style.width).toBe('60%')
  })
})

describe('Animation', () => {
  it('should be animated by default', () => {
    render(<Skeleton testID="animated-skeleton" />)
    const skeleton = screen.getByTestId('animated-skeleton')
    expect(skeleton.props.children).toBeTruthy()
  })

  it('should not render animation when animated is false', () => {
    render(<Skeleton animated={false} testID="not-animated-skeleton" />)
    const skeleton = screen.getByTestId('not-animated-skeleton')
    expect(skeleton.props.children).toBeFalsy()
  })

  it('should render shimmer for each line when animated', () => {
    render(
      <Skeleton
        variant="text"
        lines={2}
        animated
        testID="animated-lines-skeleton"
      />,
    )
    expect(screen.getByTestId('animated-lines-skeleton-line-0')).toBeTruthy()
    expect(screen.getByTestId('animated-lines-skeleton-line-1')).toBeTruthy()
  })
})

describe('Custom Colors', () => {
  it('should apply custom backgroundColor', () => {
    render(<Skeleton backgroundColor="#FF0000" testID="custom-bg-skeleton" />)
    const skeleton = screen.getByTestId('custom-bg-skeleton')
    expect(skeleton.props.style.backgroundColor).toBe('#FF0000')
  })

  it('should apply custom highlightColor', () => {
    render(
      <Skeleton highlightColor="#00FF00" testID="custom-highlight-skeleton" />,
    )
    expect(screen.getByTestId('custom-highlight-skeleton')).toBeTruthy()
  })

  it('should use default colors when not provided', () => {
    render(<Skeleton testID="default-colors-skeleton" />)
    const skeleton = screen.getByTestId('default-colors-skeleton')
    expect(skeleton.props.style.backgroundColor).toBe(Colors.light.primary)
  })
})

describe('Responsive Behavior', () => {
  it('should render with responsive sizing', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: false,
    })
    render(<Skeleton responsive width={100} testID="responsive-skeleton" />)
    const skeleton = screen.getByTestId('responsive-skeleton')
    expect(skeleton.props.style.width).toBe(100)
  })

  it('should apply mobile adjustments for small phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(<Skeleton responsive width={100} testID="small-phone-skeleton" />)
    const skeleton = screen.getByTestId('small-phone-skeleton')
    expect(skeleton.props.style.width).toBeLessThan(100)
  })

  it('should apply mobile adjustments for large phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: true,
    })

    render(<Skeleton responsive width={100} testID="large-phone-skeleton" />)
    const skeleton = screen.getByTestId('large-phone-skeleton')
    expect(skeleton.props.style.width).toBeGreaterThan(100)
  })

  it('should not apply responsive adjustments when responsive is false', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <Skeleton
        responsive={false}
        width={100}
        testID="non-responsive-skeleton"
      />,
    )
    const skeleton = screen.getByTestId('non-responsive-skeleton')
    expect(skeleton.props.style.width).toBe(100)
  })

  it('should not apply responsive to percentage values', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <Skeleton
        responsive
        width="50%"
        testID="percentage-responsive-skeleton"
      />,
    )
    const skeleton = screen.getByTestId('percentage-responsive-skeleton')
    expect(skeleton.props.style.width).toBe('50%')
  })
})

describe('Accessibility', () => {
  it('should have correct accessibility role', () => {
    render(<Skeleton testID="accessible-skeleton" />)
    const skeleton = screen.getByTestId('accessible-skeleton')
    expect(skeleton.props.accessibilityRole).toBe('none')
  })

  it('should have Loading accessibility label', () => {
    render(<Skeleton testID="label-skeleton" />)
    const skeleton = screen.getByTestId('label-skeleton')
    expect(skeleton.props.accessibilityLabel).toBe('Loading')
  })

  it('should be accessible', () => {
    render(<Skeleton testID="is-accessible-skeleton" />)
    const skeleton = screen.getByTestId('is-accessible-skeleton')
    expect(skeleton.props.accessible).toBe(true)
  })
})

describe('Custom Styles', () => {
  it('should accept custom styles', () => {
    const customStyle = { marginTop: 20 }
    render(<Skeleton style={customStyle} testID="custom-style-skeleton" />)
    const skeleton = screen.getByTestId('custom-style-skeleton')
    expect(skeleton.props.style.marginTop).toBe(20)
  })

  it('should merge custom styles with default styles', () => {
    const customStyle = { opacity: 0.8 }
    render(<Skeleton style={customStyle} testID="merged-style-skeleton" />)
    const skeleton = screen.getByTestId('merged-style-skeleton')
    expect(skeleton.props.style.opacity).toBe(0.8)
    expect(skeleton.props.style.width).toBe('100%')
  })
})

describe('Overflow', () => {
  it('should have overflow hidden', () => {
    render(<Skeleton testID="overflow-skeleton" />)
    const skeleton = screen.getByTestId('overflow-skeleton')
    expect(skeleton.props.style.overflow).toBe('hidden')
  })
})

describe('Animation Duration', () => {
  it('should use default animation duration', () => {
    render(<Skeleton testID="default-duration-skeleton" />)
    expect(screen.getByTestId('default-duration-skeleton')).toBeTruthy()
  })

  it('should accept custom animation duration', () => {
    render(
      <Skeleton animationDuration={2000} testID="custom-duration-skeleton" />,
    )
    expect(screen.getByTestId('custom-duration-skeleton')).toBeTruthy()
  })
})

describe('Combined Variants', () => {
  it('should handle circle with custom size', () => {
    render(<Skeleton variant="circle" width={80} testID="circle-custom-size" />)
    const skeleton = screen.getByTestId('circle-custom-size')
    expect(skeleton.props.style.width).toBe(80)
    expect(skeleton.props.style.height).toBe(80)
    expect(skeleton.props.style.borderRadius).toBe(9999)
  })

  it('should handle text with multiple lines and custom size', () => {
    render(
      <Skeleton variant="text" lines={3} size="lg" testID="text-multi-lg" />,
    )
    expect(screen.getByTestId('text-multi-lg-line-0')).toBeTruthy()
    expect(screen.getByTestId('text-multi-lg-line-1')).toBeTruthy()
    expect(screen.getByTestId('text-multi-lg-line-2')).toBeTruthy()
  })

  it('should handle custom colors with animation', () => {
    render(
      <Skeleton
        backgroundColor="#AAAAAA"
        highlightColor="#FFFFFF"
        animated
        testID="colored-animated"
      />,
    )
    const skeleton = screen.getByTestId('colored-animated')
    expect(skeleton.props.style.backgroundColor).toBe('#AAAAAA')
    expect(skeleton.props.children).toBeTruthy()
  })
})

describe('Edge Cases', () => {
  it('should handle lines = 0', () => {
    render(<Skeleton variant="text" lines={0} testID="zero-lines-skeleton" />)
    expect(screen.getByTestId('zero-lines-skeleton')).toBeTruthy()
  })

  it('should handle negative lineSpacing', () => {
    render(
      <Skeleton
        variant="text"
        lines={2}
        lineSpacing={-5}
        testID="negative-spacing-skeleton"
      />,
    )
    expect(screen.getByTestId('negative-spacing-skeleton-line-0')).toBeTruthy()
  })

  it('should handle zero width', () => {
    render(<Skeleton width={0} testID="zero-width-skeleton" />)
    const skeleton = screen.getByTestId('zero-width-skeleton')
    expect(skeleton.props.style.width).toBe(0)
  })

  it('should handle zero height', () => {
    render(<Skeleton height={0} testID="zero-height-skeleton" />)
    const skeleton = screen.getByTestId('zero-height-skeleton')
    expect(skeleton.props.style.height).toBe(0)
  })
})

describe('Default Values', () => {
  it('should use default variant rect', () => {
    render(<Skeleton testID="default-variant-check" />)
    const skeleton = screen.getByTestId('default-variant-check')
    expect(skeleton.props.style.borderRadius).toBe(8)
  })

  it('should use default size base', () => {
    render(<Skeleton variant="text" testID="default-size-check" />)
    const skeleton = screen.getByTestId('default-size-check')
    expect(skeleton.props.style.height).toBe(16)
  })

  it('should use default lines 1', () => {
    render(<Skeleton variant="text" testID="default-lines-check" />)
    expect(screen.getByTestId('default-lines-check')).toBeTruthy()
    expect(screen.queryByTestId('default-lines-check-line-0')).toBeNull()
  })

  it('should use default lineSpacing 8', () => {
    render(
      <Skeleton variant="text" lines={2} testID="default-line-spacing-check" />,
    )
    const line1 = screen.getByTestId('default-line-spacing-check-line-1')
    expect(line1.props.style.marginTop).toBe(8)
  })

  it('should use default animated true', () => {
    render(<Skeleton testID="default-animated-check" />)
    const skeleton = screen.getByTestId('default-animated-check')
    expect(skeleton.props.children).toBeTruthy()
  })
})
