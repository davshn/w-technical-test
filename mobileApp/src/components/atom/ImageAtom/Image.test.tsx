import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native'

import { Image } from '../../atom'
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

const mockSource = { uri: 'https://example.com/image.jpg' }
const mockFallback = { uri: 'https://example.com/fallback.jpg' }

describe('Rendering', () => {
  it('should render without crashing', () => {
    render(<Image source={mockSource} testID="image" />)
    expect(screen.getByTestId('image')).toBeTruthy()
  })

  it('should render with default props', () => {
    render(<Image source={mockSource} testID="default-image" />)
    const image = screen.getByTestId('default-image')
    expect(image).toBeTruthy()
  })

  it('should render RNImage component', () => {
    render(<Image source={mockSource} testID="image" />)
    expect(screen.getByTestId('image-image')).toBeTruthy()
  })

  it('should render with custom testID', () => {
    render(<Image source={mockSource} testID="custom-image" />)
    expect(screen.getByTestId('custom-image')).toBeTruthy()
  })
})

describe('Size Variants', () => {
  it('should render with xs size', () => {
    render(<Image source={mockSource} size="xs" testID="xs-image" />)
    const image = screen.getByTestId('xs-image')
    expect(image.props.style.width).toBe(40)
    expect(image.props.style.height).toBe(40)
  })

  it('should render with sm size', () => {
    render(<Image source={mockSource} size="sm" testID="sm-image" />)
    const image = screen.getByTestId('sm-image')
    expect(image.props.style.width).toBe(80)
    expect(image.props.style.height).toBe(80)
  })

  it('should render with base size', () => {
    render(<Image source={mockSource} size="base" testID="base-image" />)
    const image = screen.getByTestId('base-image')
    expect(image.props.style.width).toBe(120)
    expect(image.props.style.height).toBe(120)
  })

  it('should render with lg size', () => {
    render(<Image source={mockSource} size="lg" testID="lg-image" />)
    const image = screen.getByTestId('lg-image')
    expect(image.props.style.width).toBe(200)
    expect(image.props.style.height).toBe(200)
  })

  it('should render with xl size', () => {
    render(<Image source={mockSource} size="xl" testID="xl-image" />)
    const image = screen.getByTestId('xl-image')
    expect(image.props.style.width).toBe(300)
    expect(image.props.style.height).toBe(300)
  })

  it('should render with full size', () => {
    render(<Image source={mockSource} size="full" testID="full-image" />)
    const image = screen.getByTestId('full-image')
    expect(image.props.style.width).toBe('100%')
    expect(image.props.style.height).toBe(200)
  })
})

describe('Aspect Ratio', () => {
  it('should apply square aspect ratio', () => {
    render(
      <Image source={mockSource} aspectRatio="square" testID="square-image" />,
    )
    const image = screen.getByTestId('square-image')
    expect(image.props.style.width).toBe(120)
    expect(image.props.style.height).toBe(120)
  })

  it('should apply 4:3 aspect ratio', () => {
    render(<Image source={mockSource} aspectRatio="4:3" testID="4-3-image" />)
    const image = screen.getByTestId('4-3-image')
    expect(image.props.style.height).toBe(90)
  })

  it('should apply 16:9 aspect ratio', () => {
    render(<Image source={mockSource} aspectRatio="16:9" testID="16-9-image" />)
    const image = screen.getByTestId('16-9-image')
    expect(image.props.style.height).toBeCloseTo(67.5, 0)
  })

  it('should apply 21:9 aspect ratio', () => {
    render(<Image source={mockSource} aspectRatio="21:9" testID="21-9-image" />)
    const image = screen.getByTestId('21-9-image')
    expect(image.props.style.height).toBeCloseTo(51.4, 0)
  })

  it('should use auto aspect ratio by default', () => {
    render(<Image source={mockSource} aspectRatio="auto" testID="auto-image" />)
    const image = screen.getByTestId('auto-image')
    expect(image.props.style.height).toBe(120)
  })
})

describe('Resize Mode', () => {
  it('should apply cover resize mode by default', () => {
    render(<Image source={mockSource} testID="cover-image" />)
    const img = screen.getByTestId('cover-image-image')
    expect(img.props.resizeMode).toBe('cover')
  })

  it('should apply contain resize mode', () => {
    render(
      <Image source={mockSource} resizeMode="contain" testID="contain-image" />,
    )
    const img = screen.getByTestId('contain-image-image')
    expect(img.props.resizeMode).toBe('contain')
  })

  it('should apply stretch resize mode', () => {
    render(
      <Image source={mockSource} resizeMode="stretch" testID="stretch-image" />,
    )
    const img = screen.getByTestId('stretch-image-image')
    expect(img.props.resizeMode).toBe('stretch')
  })

  it('should apply center resize mode', () => {
    render(
      <Image source={mockSource} resizeMode="center" testID="center-image" />,
    )
    const img = screen.getByTestId('center-image-image')
    expect(img.props.resizeMode).toBe('center')
  })
})

describe('Custom Dimensions', () => {
  it('should apply custom width', () => {
    render(
      <Image
        source={mockSource}
        customWidth={250}
        testID="custom-width-image"
      />,
    )
    const image = screen.getByTestId('custom-width-image')
    expect(image.props.style.width).toBe(250)
  })

  it('should apply custom height', () => {
    render(
      <Image
        source={mockSource}
        customHeight={150}
        testID="custom-height-image"
      />,
    )
    const image = screen.getByTestId('custom-height-image')
    expect(image.props.style.height).toBe(150)
  })

  it('should apply both custom width and height', () => {
    render(
      <Image
        source={mockSource}
        customWidth={300}
        customHeight={200}
        testID="custom-dimensions-image"
      />,
    )
    const image = screen.getByTestId('custom-dimensions-image')
    expect(image.props.style.width).toBe(300)
    expect(image.props.style.height).toBe(200)
  })

  it('should apply percentage width', () => {
    render(
      <Image
        source={mockSource}
        customWidth="80%"
        testID="percentage-width-image"
      />,
    )
    const image = screen.getByTestId('percentage-width-image')
    expect(image.props.style.width).toBe('80%')
  })
})

describe('Border Radius', () => {
  it('should have no border radius by default', () => {
    render(<Image source={mockSource} testID="no-radius-image" />)
    const image = screen.getByTestId('no-radius-image')
    expect(image.props.style.borderRadius).toBe(0)
  })

  it('should apply custom border radius', () => {
    render(
      <Image source={mockSource} borderRadius={12} testID="radius-image" />,
    )
    const image = screen.getByTestId('radius-image')
    expect(image.props.style.borderRadius).toBe(12)
  })

  it('should apply circular border radius', () => {
    render(
      <Image source={mockSource} borderRadius={9999} testID="circular-image" />,
    )
    const image = screen.getByTestId('circular-image')
    expect(image.props.style.borderRadius).toBe(9999)
  })
})

describe('Loading State', () => {
  it('should show loader by default when loading', () => {
    render(<Image source={mockSource} testID="loading-image" />)
    expect(screen.getByTestId('loading-image-loader')).toBeTruthy()
  })

  it('should not show loader when showLoader is false', () => {
    render(
      <Image source={mockSource} showLoader={false} testID="no-loader-image" />,
    )
    expect(screen.queryByTestId('no-loader-image-loader')).toBeNull()
  })

  it('should apply small loader size by default', () => {
    render(<Image source={mockSource} testID="small-loader-image" />)
    const loader = screen.getByTestId('small-loader-image-loader')
    expect(loader.props.size).toBe('small')
  })

  it('should apply large loader size', () => {
    render(
      <Image
        source={mockSource}
        loaderSize="large"
        testID="large-loader-image"
      />,
    )
    const loader = screen.getByTestId('large-loader-image-loader')
    expect(loader.props.size).toBe('large')
  })
})

describe('Error Handling', () => {
  it('should call onLoadError when image fails to load', () => {
    const onLoadError = jest.fn()
    render(
      <Image
        source={mockSource}
        onLoadError={onLoadError}
        testID="error-image"
      />,
    )
    const img = screen.getByTestId('error-image-image')
    fireEvent(img, 'error')
    expect(onLoadError).toHaveBeenCalled()
  })

  it('should use fallback source on error', () => {
    render(
      <Image
        source={mockSource}
        fallback={mockFallback}
        testID="fallback-image"
      />,
    )
    const img = screen.getByTestId('fallback-image-image')
    fireEvent(img, 'error')

    waitFor(() => {
      expect(img.props.source).toEqual(mockFallback)
    })
  })

  it('should not render image when error state with no fallback', () => {
    render(<Image source={mockSource} testID="error-no-fallback-image" />)
    const img = screen.getByTestId('error-no-fallback-image-image')
    fireEvent(img, 'error')

    waitFor(() => {
      expect(screen.queryByTestId('error-no-fallback-image-image')).toBeNull()
    })
  })
})

describe('Success Loading', () => {
  it('should call onLoadSuccess when image loads successfully', () => {
    const onLoadSuccess = jest.fn()
    render(
      <Image
        source={mockSource}
        onLoadSuccess={onLoadSuccess}
        testID="success-image"
      />,
    )
    const img = screen.getByTestId('success-image-image')
    fireEvent(img, 'load')
    expect(onLoadSuccess).toHaveBeenCalled()
  })

  it('should hide loader after successful load', () => {
    render(<Image source={mockSource} testID="loaded-image" />)
    const img = screen.getByTestId('loaded-image-image')

    expect(screen.getByTestId('loaded-image-loader')).toBeTruthy()

    fireEvent(img, 'load')

    waitFor(() => {
      expect(screen.queryByTestId('loaded-image-loader')).toBeNull()
    })
  })

  it('should not call onLoadSuccess when fallback is used', () => {
    const onLoadSuccess = jest.fn()
    render(
      <Image
        source={mockSource}
        fallback={mockFallback}
        onLoadSuccess={onLoadSuccess}
        testID="fallback-success-image"
      />,
    )
    const img = screen.getByTestId('fallback-success-image-image')

    fireEvent(img, 'error')
    fireEvent(img, 'load')

    expect(onLoadSuccess).not.toHaveBeenCalled()
  })
})

describe('Responsive Behavior', () => {
  it('should render with responsive sizing', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: false,
    })
    render(<Image source={mockSource} responsive testID="responsive-image" />)
    const image = screen.getByTestId('responsive-image')
    expect(image.props.style.width).toBe(120)
  })

  it('should apply mobile adjustments for small phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(<Image source={mockSource} responsive testID="small-phone-image" />)
    const image = screen.getByTestId('small-phone-image')
    expect(image.props.style.width).toBeLessThan(120)
  })

  it('should apply mobile adjustments for large phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: true,
    })

    render(<Image source={mockSource} responsive testID="large-phone-image" />)
    const image = screen.getByTestId('large-phone-image')
    expect(image.props.style.width).toBeGreaterThan(120)
  })

  it('should not apply responsive to full width', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <Image
        source={mockSource}
        size="full"
        responsive
        testID="full-responsive-image"
      />,
    )
    const image = screen.getByTestId('full-responsive-image')
    expect(image.props.style.width).toBe('100%')
  })
})

describe('Accessibility', () => {
  it('should have correct accessibility role', () => {
    render(<Image source={mockSource} testID="accessible-image" />)
    const image = screen.getByTestId('accessible-image')
    expect(image.props.accessibilityRole).toBe('image')
  })

  it('should be accessible', () => {
    render(<Image source={mockSource} testID="is-accessible-image" />)
    const image = screen.getByTestId('is-accessible-image')
    expect(image.props.accessible).toBe(true)
  })
})

describe('Custom Styles', () => {
  it('should accept custom container styles', () => {
    const customStyle = { marginTop: 20 }
    render(
      <Image
        source={mockSource}
        containerStyle={customStyle}
        testID="custom-container-image"
      />,
    )
    const image = screen.getByTestId('custom-container-image')
    expect(image.props.style.marginTop).toBe(20)
  })

  it('should accept custom image styles', () => {
    const customStyle = { opacity: 0.8 }
    render(
      <Image
        source={mockSource}
        style={customStyle}
        testID="custom-style-image"
      />,
    )
    expect(screen.getByTestId('custom-style-image-image')).toBeTruthy()
  })
})

describe('Source Types', () => {
  it('should handle URI source', () => {
    render(
      <Image
        source={{ uri: 'https://example.com/image.jpg' }}
        testID="uri-image"
      />,
    )
    expect(screen.getByTestId('uri-image-image')).toBeTruthy()
  })

  it('should handle local source', () => {
    render(<Image source={12345} testID="local-image" />)
    expect(screen.getByTestId('local-image-image')).toBeTruthy()
  })

  it('should handle fallback URI source', () => {
    render(
      <Image
        source={mockSource}
        fallback={{ uri: 'https://example.com/fallback.jpg' }}
        testID="fallback-uri-image"
      />,
    )
    expect(screen.getByTestId('fallback-uri-image-image')).toBeTruthy()
  })

  it('should handle fallback local source', () => {
    render(
      <Image
        source={mockSource}
        fallback={67890}
        testID="fallback-local-image"
      />,
    )
    expect(screen.getByTestId('fallback-local-image-image')).toBeTruthy()
  })
})

describe('Layout Properties', () => {
  it('should have overflow hidden', () => {
    render(<Image source={mockSource} testID="overflow-image" />)
    const image = screen.getByTestId('overflow-image')
    expect(image.props.style.overflow).toBe('hidden')
  })

  it('should have default background color', () => {
    render(<Image source={mockSource} testID="bg-image" />)
    const image = screen.getByTestId('bg-image')
    expect(image.props.style.backgroundColor).toBe(Colors.light.background)
  })
})

describe('Error State Background', () => {
  it('should change background color on error', () => {
    render(<Image source={mockSource} testID="error-bg-image" />)
    const img = screen.getByTestId('error-bg-image-image')
    const container = screen.getByTestId('error-bg-image')

    fireEvent(img, 'error')

    waitFor(() => {
      expect(container.props.style.backgroundColor).toBe(Colors.light.tint)
    })
  })
})

describe('Load Start', () => {
  it('should handle onLoadStart event', () => {
    render(<Image source={mockSource} testID="loadstart-image" />)
    const img = screen.getByTestId('loadstart-image-image')
    fireEvent(img, 'loadStart')
    expect(screen.getByTestId('loadstart-image-loader')).toBeTruthy()
  })
})

describe('Combined Props', () => {
  it('should handle multiple props together', () => {
    render(
      <Image
        source={mockSource}
        size="lg"
        aspectRatio="16:9"
        borderRadius={16}
        resizeMode="contain"
        testID="combined-image"
      />,
    )
    const image = screen.getByTestId('combined-image')
    const img = screen.getByTestId('combined-image-image')

    expect(image.props.style.width).toBe(200)
    expect(image.props.style.borderRadius).toBe(16)
    expect(img.props.resizeMode).toBe('contain')
  })

  it('should handle custom dimensions with aspect ratio', () => {
    render(
      <Image
        source={mockSource}
        customWidth={400}
        aspectRatio="16:9"
        testID="custom-aspect-image"
      />,
    )
    const image = screen.getByTestId('custom-aspect-image')
    expect(image.props.style.width).toBe(400)
    expect(image.props.style.height).toBe(225)
  })
})

describe('Image Style', () => {
  it('should apply full width and height to image', () => {
    render(<Image source={mockSource} testID="full-size-img" />)
    const img = screen.getByTestId('full-size-img-image')
    expect(img.props.style.width).toBe('100%')
    expect(img.props.style.height).toBe('100%')
  })
})
