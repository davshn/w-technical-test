import { render, screen } from '@testing-library/react-native'

import { Spacer } from '../../atom'

jest.mock('../../../hooks/useResponsive', () => ({
  useResponsive: jest.fn(() => ({
    isSmallPhone: false,
    isLargePhone: false,
  })),
}))

describe('SpacerAtom', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Spacer testID="spacer" />)
      expect(screen.getByTestId('spacer')).toBeTruthy()
    })

    it('should render with default props', () => {
      render(<Spacer testID="default-spacer" />)
      const spacer = screen.getByTestId('default-spacer')
      expect(spacer).toBeTruthy()
    })

    it('should render with custom testID', () => {
      render(<Spacer testID="custom-spacer" />)
      expect(screen.getByTestId('custom-spacer')).toBeTruthy()
    })
  })

  describe('Size Variants', () => {
    it('should render with xs size', () => {
      render(<Spacer size="xs" testID="xs-spacer" />)
      const spacer = screen.getByTestId('xs-spacer')
      expect(spacer.props.style.height).toBe(4)
    })

    it('should render with sm size', () => {
      render(<Spacer size="sm" testID="sm-spacer" />)
      const spacer = screen.getByTestId('sm-spacer')
      expect(spacer.props.style.height).toBe(8)
    })

    it('should render with base size', () => {
      render(<Spacer size="base" testID="base-spacer" />)
      const spacer = screen.getByTestId('base-spacer')
      expect(spacer.props.style.height).toBe(16)
    })

    it('should render with lg size', () => {
      render(<Spacer size="lg" testID="lg-spacer" />)
      const spacer = screen.getByTestId('lg-spacer')
      expect(spacer.props.style.height).toBe(24)
    })

    it('should render with xl size', () => {
      render(<Spacer size="xl" testID="xl-spacer" />)
      const spacer = screen.getByTestId('xl-spacer')
      expect(spacer.props.style.height).toBe(32)
    })

    it('should render with 2xl size', () => {
      render(<Spacer size="2xl" testID="2xl-spacer" />)
      const spacer = screen.getByTestId('2xl-spacer')
      expect(spacer.props.style.height).toBe(48)
    })

    it('should render with 3xl size', () => {
      render(<Spacer size="3xl" testID="3xl-spacer" />)
      const spacer = screen.getByTestId('3xl-spacer')
      expect(spacer.props.style.height).toBe(64)
    })

    it('should render with 4xl size', () => {
      render(<Spacer size="4xl" testID="4xl-spacer" />)
      const spacer = screen.getByTestId('4xl-spacer')
      expect(spacer.props.style.height).toBe(96)
    })
  })

  describe('Direction', () => {
    it('should render vertical direction by default', () => {
      render(<Spacer testID="default-direction-spacer" />)
      const spacer = screen.getByTestId('default-direction-spacer')
      expect(spacer.props.style.height).toBe(16)
      expect(spacer.props.style.width).toBe('100%')
    })

    it('should render with vertical direction', () => {
      render(<Spacer direction="vertical" testID="vertical-spacer" />)
      const spacer = screen.getByTestId('vertical-spacer')
      expect(spacer.props.style.height).toBe(16)
      expect(spacer.props.style.width).toBe('100%')
    })

    it('should render with horizontal direction', () => {
      render(<Spacer direction="horizontal" testID="horizontal-spacer" />)
      const spacer = screen.getByTestId('horizontal-spacer')
      expect(spacer.props.style.width).toBe(16)
      expect(spacer.props.style.height).toBe('100%')
    })
  })

  describe('Custom Size', () => {
    it('should render with custom size', () => {
      render(<Spacer customSize={50} testID="custom-size-spacer" />)
      const spacer = screen.getByTestId('custom-size-spacer')
      expect(spacer.props.style.height).toBe(50)
    })

    it('should prioritize custom size over predefined size', () => {
      render(<Spacer size="xl" customSize={100} testID="priority-spacer" />)
      const spacer = screen.getByTestId('priority-spacer')
      expect(spacer.props.style.height).toBe(100)
    })

    it('should work with custom size and horizontal direction', () => {
      render(
        <Spacer
          direction="horizontal"
          customSize={75}
          testID="custom-horizontal-spacer"
        />,
      )
      const spacer = screen.getByTestId('custom-horizontal-spacer')
      expect(spacer.props.style.width).toBe(75)
    })
  })

  describe('Flex', () => {
    it('should not have flex by default', () => {
      render(<Spacer testID="no-flex-spacer" />)
      const spacer = screen.getByTestId('no-flex-spacer')
      expect(spacer.props.style.flex).toBeUndefined()
    })

    it('should render with flex', () => {
      render(<Spacer flex={1} testID="flex-spacer" />)
      const spacer = screen.getByTestId('flex-spacer')
      expect(spacer.props.style.flex).toBe(1)
    })

    it('should render with custom flex value', () => {
      render(<Spacer flex={2} testID="custom-flex-spacer" />)
      const spacer = screen.getByTestId('custom-flex-spacer')
      expect(spacer.props.style.flex).toBe(2)
    })
  })

  describe('Responsive Behavior', () => {
    it('should render with responsive sizing', () => {
      render(<Spacer responsive testID="responsive-spacer" />)
      expect(screen.getByTestId('responsive-spacer')).toBeTruthy()
    })

    it('should apply mobile adjustments for small phones', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: true,
        isLargePhone: false,
      })

      render(<Spacer responsive testID="small-phone-spacer" />)
      const spacer = screen.getByTestId('small-phone-spacer')
      expect(spacer.props.style.height).toBeLessThan(16)
    })

    it('should apply mobile adjustments for large phones', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: false,
        isLargePhone: true,
      })

      render(<Spacer responsive testID="large-phone-spacer" />)
      const spacer = screen.getByTestId('large-phone-spacer')
      expect(spacer.props.style.height).toBeGreaterThan(16)
    })

    it('should not apply responsive to custom size', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: true,
        isLargePhone: false,
      })

      render(
        <Spacer responsive customSize={50} testID="custom-responsive-spacer" />,
      )
      const spacer = screen.getByTestId('custom-responsive-spacer')
      expect(spacer.props.style.height).toBe(50)
    })
  })

  describe('Accessibility', () => {
    it('should not be accessible', () => {
      render(<Spacer testID="not-accessible-spacer" />)
      const spacer = screen.getByTestId('not-accessible-spacer')
      expect(spacer.props.accessible).toBe(false)
    })
  })

  describe('Combination Tests', () => {
    it('should render with multiple props combined', () => {
      render(
        <Spacer
          size="lg"
          direction="vertical"
          responsive
          testID="combined-spacer"
        />,
      )
      const spacer = screen.getByTestId('combined-spacer')
      expect(spacer).toBeTruthy()
    })

    it('should render horizontal spacer with custom size and flex', () => {
      render(
        <Spacer
          direction="horizontal"
          customSize={40}
          flex={1}
          testID="horizontal-combined-spacer"
        />,
      )
      const spacer = screen.getByTestId('horizontal-combined-spacer')
      expect(spacer.props.style.width).toBe(40)
      expect(spacer.props.style.height).toBe('100%')
      expect(spacer.props.style.flex).toBe(1)
    })

    it('should render vertical spacer with all props', () => {
      render(
        <Spacer
          size="2xl"
          direction="vertical"
          flex={2}
          responsive
          testID="vertical-combined-spacer"
        />,
      )
      const spacer = screen.getByTestId('vertical-combined-spacer')
      expect(spacer.props.style.flex).toBe(2)
      expect(spacer.props.style.width).toBe('100%')
    })
  })

  describe('Edge Cases', () => {
    it('should handle size zero', () => {
      render(<Spacer customSize={0} testID="zero-size-spacer" />)
      const spacer = screen.getByTestId('zero-size-spacer')
      expect(spacer.props.style.height).toBe(0)
    })

    it('should handle very large custom size', () => {
      render(<Spacer customSize={500} testID="large-size-spacer" />)
      const spacer = screen.getByTestId('large-size-spacer')
      expect(spacer.props.style.height).toBe(500)
    })

    it('should handle flex with zero value', () => {
      render(<Spacer flex={0} testID="zero-flex-spacer" />)
      const spacer = screen.getByTestId('zero-flex-spacer')
      expect(spacer.props.style.flex).toBe(0)
    })
  })
})
