import { render, screen } from '@testing-library/react-native'

import { Divider } from '../../atom'


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

describe('DividerAtom', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Divider testID="divider" />)
      expect(screen.getByTestId('divider')).toBeTruthy()
    })

    it('should render with default props', () => {
      render(<Divider testID="default-divider" />)
      const divider = screen.getByTestId('default-divider')
      expect(divider).toBeTruthy()
    })

    it('should render with custom testID', () => {
      render(<Divider testID="custom-divider" />)
      expect(screen.getByTestId('custom-divider')).toBeTruthy()
    })
  })

  describe('Orientation', () => {
    it('should render horizontal orientation by default', () => {
      render(<Divider testID="horizontal-default-divider" />)
      const divider = screen.getByTestId('horizontal-default-divider')
      expect(divider.props.style.width).toBe('100%')
    })

    it('should render horizontal orientation', () => {
      render(<Divider orientation="horizontal" testID="horizontal-divider" />)
      const divider = screen.getByTestId('horizontal-divider')
      expect(divider.props.style.width).toBe('100%')
    })

    it('should render vertical orientation', () => {
      render(<Divider orientation="vertical" testID="vertical-divider" />)
      const divider = screen.getByTestId('vertical-divider')
      expect(divider.props.style.height).toBe('100%')
    })
  })

  describe('Variant Styles', () => {
    it('should render with solid variant', () => {
      render(<Divider variant="solid" testID="solid-divider" />)
      const divider = screen.getByTestId('solid-divider')
      expect(divider.props.style.backgroundColor).toBeTruthy()
    })

    it('should render with dashed variant', () => {
      render(<Divider variant="dashed" testID="dashed-divider" />)
      const divider = screen.getByTestId('dashed-divider')
      expect(divider.props.style.borderStyle).toBe('dashed')
    })

    it('should render with dotted variant', () => {
      render(<Divider variant="dotted" testID="dotted-divider" />)
      const divider = screen.getByTestId('dotted-divider')
      expect(divider.props.style.borderStyle).toBe('dotted')
    })
  })

  describe('Thickness Options', () => {
    it('should render with thin thickness', () => {
      render(<Divider thickness="thin" testID="thin-divider" />)
      const divider = screen.getByTestId('thin-divider')
      expect(divider.props.style.height).toBe(1)
    })

    it('should render with base thickness', () => {
      render(<Divider thickness="base" testID="base-divider" />)
      const divider = screen.getByTestId('base-divider')
      expect(divider.props.style.height).toBe(2)
    })

    it('should render with thick thickness', () => {
      render(<Divider thickness="thick" testID="thick-divider" />)
      const divider = screen.getByTestId('thick-divider')
      expect(divider.props.style.height).toBe(4)
    })
  })

  describe('Spacing Options', () => {
    it('should render with none spacing', () => {
      render(<Divider spacing="none" testID="none-spacing-divider" />)
      const divider = screen.getByTestId('none-spacing-divider')
      expect(divider.props.style.marginVertical).toBe(0)
    })

    it('should render with xs spacing', () => {
      render(<Divider spacing="xs" testID="xs-spacing-divider" />)
      const divider = screen.getByTestId('xs-spacing-divider')
      expect(divider.props.style.marginVertical).toBe(4)
    })

    it('should render with sm spacing', () => {
      render(<Divider spacing="sm" testID="sm-spacing-divider" />)
      const divider = screen.getByTestId('sm-spacing-divider')
      expect(divider.props.style.marginVertical).toBe(8)
    })

    it('should render with base spacing', () => {
      render(<Divider spacing="base" testID="base-spacing-divider" />)
      const divider = screen.getByTestId('base-spacing-divider')
      expect(divider.props.style.marginVertical).toBe(16)
    })

    it('should render with lg spacing', () => {
      render(<Divider spacing="lg" testID="lg-spacing-divider" />)
      const divider = screen.getByTestId('lg-spacing-divider')
      expect(divider.props.style.marginVertical).toBe(24)
    })

    it('should render with xl spacing', () => {
      render(<Divider spacing="xl" testID="xl-spacing-divider" />)
      const divider = screen.getByTestId('xl-spacing-divider')
      expect(divider.props.style.marginVertical).toBe(32)
    })
  })

  describe('Color Customization', () => {
    it('should render with custom color', () => {
      render(<Divider color="#FF0000" testID="custom-color-divider" />)
      const divider = screen.getByTestId('custom-color-divider')
      expect(divider.props.style.backgroundColor).toBe('#FF0000')
    })

    it('should use default color when not specified', () => {
      render(<Divider testID="default-color-divider" />)
      expect(screen.getByTestId('default-color-divider')).toBeTruthy()
    })
  })

  describe('Length Options', () => {
    it('should render with full length by default', () => {
      render(<Divider testID="full-length-divider" />)
      const divider = screen.getByTestId('full-length-divider')
      expect(divider.props.style.width).toBe('100%')
    })

    it('should render with custom percentage length', () => {
      render(<Divider length="50%" testID="percentage-length-divider" />)
      const divider = screen.getByTestId('percentage-length-divider')
      expect(divider.props.style.width).toBe('50%')
    })

    it('should render with custom numeric length', () => {
      render(<Divider length={200} testID="numeric-length-divider" />)
      const divider = screen.getByTestId('numeric-length-divider')
      expect(divider.props.style.width).toBe(200)
    })
  })

  describe('Responsive Behavior', () => {
    it('should render with responsive sizing', () => {
      render(<Divider responsive testID="responsive-divider" />)
      expect(screen.getByTestId('responsive-divider')).toBeTruthy()
    })

    it('should apply mobile adjustments for small phones', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: true,
        isLargePhone: false,
      })

      render(<Divider responsive testID="small-phone-divider" />)
      const divider = screen.getByTestId('small-phone-divider')
      expect(divider.props.style.height).toBeLessThanOrEqual(2)
    })

    it('should apply mobile adjustments for large phones', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: false,
        isLargePhone: true,
      })

      render(<Divider responsive testID="large-phone-divider" />)
      const divider = screen.getByTestId('large-phone-divider')
      expect(divider.props.style.height).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Accessibility', () => {
    it('should have correct accessibility role', () => {
      render(<Divider testID="accessible-divider" />)
      const divider = screen.getByTestId('accessible-divider')
      expect(divider.props.accessibilityRole).toBe('none')
    })

    it('should have accessibility label', () => {
      render(<Divider testID="labeled-divider" />)
      const divider = screen.getByTestId('labeled-divider')
      expect(divider.props.accessibilityLabel).toBe('divider')
    })

    it('should be accessible', () => {
      render(<Divider testID="is-accessible-divider" />)
      const divider = screen.getByTestId('is-accessible-divider')
      expect(divider.props.accessible).toBe(true)
    })
  })

  describe('Custom Styles', () => {
    it('should accept custom styles', () => {
      const customStyle = { marginTop: 20 }
      render(<Divider style={customStyle} testID="custom-style-divider" />)
      const divider = screen.getByTestId('custom-style-divider')
      expect(divider.props.style.marginTop).toBe(20)
    })
  })

  describe('Combination Tests', () => {
    it('should render with multiple props combined', () => {
      render(
        <Divider
          orientation="horizontal"
          variant="dashed"
          thickness="thick"
          spacing="lg"
          color="#FF0000"
          length="80%"
          responsive
          testID="combined-divider"
        />,
      )
      const divider = screen.getByTestId('combined-divider')
      expect(divider).toBeTruthy()
    })

    it('should render vertical divider with custom props', () => {
      render(
        <Divider
          orientation="vertical"
          variant="dotted"
          thickness="base"
          spacing="sm"
          length={150}
          testID="vertical-combined-divider"
        />,
      )
      const divider = screen.getByTestId('vertical-combined-divider')
      expect(divider).toBeTruthy()
    })
  })
})
