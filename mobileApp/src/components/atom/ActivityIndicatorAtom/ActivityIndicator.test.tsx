import { render, screen } from '@testing-library/react-native'

import { ActivityIndicator } from '../../atom'
import { Colors } from '../../../constants/theme'

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

jest.mock('../../../hooks/useResponsive', () => ({
  useResponsive: jest.fn(() => ({
    isSmallPhone: false,
    isLargePhone: false,
  })),
}))

describe('ActivityIndicatorAtom', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<ActivityIndicator testID="progressbar" />)
      expect(screen.getByTestId('progressbar')).toBeTruthy()
    })

    it('should render with default props', () => {
      render(<ActivityIndicator testID="activity-indicator" />)
      const indicator = screen.getByTestId('activity-indicator')
      expect(indicator).toBeTruthy()
    })

    it('should render with custom testID', () => {
      render(<ActivityIndicator testID="custom-loader" />)
      expect(screen.getByTestId('custom-loader')).toBeTruthy()
      expect(screen.getByTestId('custom-loader-container')).toBeTruthy()
    })
  })

  describe('Size Variants', () => {
    it('should render with xs size', () => {
      render(<ActivityIndicator size="xs" testID="xs-indicator" />)
      const indicator = screen.getByTestId('xs-indicator')
      expect(indicator.props.style.transform[0].scale).toBe(12 / 24)
    })

    it('should render with sm size', () => {
      render(<ActivityIndicator size="sm" testID="sm-indicator" />)
      const indicator = screen.getByTestId('sm-indicator')
      expect(indicator.props.style.transform[0].scale).toBe(16 / 24)
    })

    it('should render with base size', () => {
      render(<ActivityIndicator size="base" testID="base-indicator" />)
      const indicator = screen.getByTestId('base-indicator')
      expect(indicator.props.style.transform[0].scale).toBe(24 / 24)
    })

    it('should render with lg size', () => {
      render(<ActivityIndicator size="lg" testID="lg-indicator" />)
      const indicator = screen.getByTestId('lg-indicator')
      expect(indicator.props.style.transform[0].scale).toBe(32 / 24)
    })

    it('should render with xl size', () => {
      render(<ActivityIndicator size="xl" testID="xl-indicator" />)
      const indicator = screen.getByTestId('xl-indicator')
      expect(indicator.props.style.transform[0].scale).toBe(48 / 24)
    })
  })

  describe('Color Variants', () => {
    it('should render with primary variant', () => {
      render(<ActivityIndicator variant="primary" testID="primary-indicator" />)
      const indicator = screen.getByTestId('primary-indicator')
      expect(indicator.props.color).toBe(Colors.light.primary)
    })

    it('should render with secondary variant', () => {
      render(
        <ActivityIndicator variant="secondary" testID="secondary-indicator" />,
      )
      const indicator = screen.getByTestId('secondary-indicator')
      expect(indicator.props.color).toBe(Colors.light.secondary)
    })

    it('should render with success variant', () => {
      render(<ActivityIndicator variant="success" testID="success-indicator" />)
      const indicator = screen.getByTestId('success-indicator')
      expect(indicator.props.color).toBe(Colors.light.success)
    })

    it('should render with warning variant', () => {
      render(<ActivityIndicator variant="warning" testID="warning-indicator" />)
      const indicator = screen.getByTestId('warning-indicator')
      expect(indicator.props.color).toBe(Colors.light.warning)
    })

    it('should render with error variant', () => {
      render(<ActivityIndicator variant="error" testID="error-indicator" />)
      const indicator = screen.getByTestId('error-indicator')
      expect(indicator.props.color).toBe(Colors.light.error)
    })

    it('should render with custom color', () => {
      render(
        <ActivityIndicator color="#FF0000" testID="custom-color-indicator" />,
      )
      const indicator = screen.getByTestId('custom-color-indicator')
      expect(indicator.props.color).toBe('#FF0000')
    })
  })

  describe('Overlay Mode', () => {
    it('should render with overlay', () => {
      render(<ActivityIndicator overlay testID="overlay-indicator" />)
      const indicator = screen.getByTestId('overlay-indicator-overlay')
      expect(indicator.props.style.zIndex).toBe(9999)
    })

    it('should render with custom overlay color', () => {
      render(
        <ActivityIndicator
          overlay
          overlayColor="rgba(255, 0, 0, 0.5)"
          testID="custom-overlay-indicator"
        />,
      )
      const indicator = screen.getByTestId('custom-overlay-indicator-overlay')
      expect(indicator.props.style.backgroundColor).toBe('rgba(255, 0, 0, 0.5)')
    })
  })

  describe('Animation State', () => {
    it('should be animating by default', () => {
      render(<ActivityIndicator testID="animating-indicator" />)
      const indicator = screen.getByTestId('animating-indicator')
      expect(indicator.props.animating).toBe(true)
    })

    it('should not be animating when animating is false', () => {
      render(<ActivityIndicator animating={false} testID="stopped-indicator" />)
      const indicator = screen.getByTestId('stopped-indicator')
      expect(indicator.props.animating).toBe(false)
    })
  })

  describe('Responsive Behavior', () => {
    it('should render with responsive sizing', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: false,
        isLargePhone: false,
      })
      render(<ActivityIndicator responsive testID="responsive-indicator" />)
      const indicator = screen.getByTestId('responsive-indicator')
      expect(indicator.props.style.transform[0].scale).toBe(1)
    })

    it('should apply mobile adjustments for small phones', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: true,
        isLargePhone: false,
      })

      render(<ActivityIndicator responsive testID="small-phone-indicator" />)
      const indicator = screen.getByTestId('small-phone-indicator')
      expect(indicator.props.style.transform[0].scale).toBeLessThan(1)
    })

    it('should apply mobile adjustments for large phones', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: false,
        isLargePhone: true,
      })
      render(<ActivityIndicator responsive testID="large-phone-indicator" />)
      const indicator = screen.getByTestId('large-phone-indicator')
      expect(indicator.props.style.transform[0].scale).toBeGreaterThan(1)
    })
  })

  describe('Accessibility', () => {
    it('should have correct accessibility role', () => {
      render(<ActivityIndicator testID="accessible-indicator" />)
      const indicator = screen.getByTestId('accessible-indicator')
      expect(indicator.props.accessibilityRole).toBe('progressbar')
    })

    it('should have accessibility label', () => {
      render(<ActivityIndicator testID="labeled-indicator" />)
      const indicator = screen.getByTestId('labeled-indicator')
      expect(indicator.props.accessibilityLabel).toBe('Loading')
    })

    it('should have busy state when animating', () => {
      render(<ActivityIndicator animating testID="busy-indicator" />)
      const indicator = screen.getByTestId('busy-indicator')
      expect(indicator.props.accessibilityState.busy).toBe(true)
    })

    it('should not have busy state when not animating', () => {
      render(<ActivityIndicator animating={false} testID="idle-indicator" />)
      const indicator = screen.getByTestId('idle-indicator')
      expect(indicator.props.accessibilityState.busy).toBe(false)
    })
  })

  describe('Custom Styles', () => {
    it('should accept custom container style', () => {
      const customStyle = { marginTop: 20 }
      render(
        <ActivityIndicator
          containerStyle={customStyle}
          testID="custom-container-indicator"
        />,
      )
      const indicator = screen.getByTestId(
        'custom-container-indicator-container',
      )
      expect(indicator.props.style.marginTop).toBe(20)
    })

    it('should accept custom indicator style', () => {
      const customStyle = { opacity: 0.5 }
      render(
        <ActivityIndicator
          style={customStyle}
          testID="custom-style-indicator"
        />,
      )
      const indicator = screen.getByTestId('custom-style-indicator')
      expect(indicator.props.style.opacity).toBe(0.5)
    })
  })
})
