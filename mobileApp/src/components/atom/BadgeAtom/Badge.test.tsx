import { render, screen } from '@testing-library/react-native'

import { Badge } from '../../atom'
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

describe('BadgeAtom', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<Badge testID="badge" />)
      expect(screen.getByTestId('badge')).toBeTruthy()
    })

    it('should render with default props', () => {
      render(<Badge label="New" testID="default-badge" />)
      const badge = screen.getByTestId('default-badge')
      expect(badge).toBeTruthy()
      expect(screen.getByText('New')).toBeTruthy()
    })

    it('should render with custom testID', () => {
      render(<Badge testID="custom-badge" />)
      expect(screen.getByTestId('custom-badge')).toBeTruthy()
    })
  })

  describe('Size Variants', () => {
    it('should render with xs size', () => {
      render(<Badge size="xs" label="XS" testID="xs-badge" />)
      const badge = screen.getByTestId('xs-badge')
      expect(badge.props.style.height).toBe(16)
    })

    it('should render with sm size', () => {
      render(<Badge size="sm" label="SM" testID="sm-badge" />)
      const badge = screen.getByTestId('sm-badge')
      expect(badge.props.style.height).toBe(18)
    })

    it('should render with base size', () => {
      render(<Badge size="base" label="Base" testID="base-badge" />)
      const badge = screen.getByTestId('base-badge')
      expect(badge.props.style.height).toBe(20)
    })

    it('should render with lg size', () => {
      render(<Badge size="lg" label="LG" testID="lg-badge" />)
      const badge = screen.getByTestId('lg-badge')
      expect(badge.props.style.height).toBe(24)
    })
  })

  describe('Color Variants', () => {
    it('should render with default variant', () => {
      render(
        <Badge
          variant="default"
          label="Default"
          testID="default-variant-badge"
        />,
      )
      expect(screen.getByTestId('default-variant-badge')).toBeTruthy()
    })

    it('should render with primary variant', () => {
      render(<Badge variant="primary" label="Primary" testID="primary-badge" />)
      const badge = screen.getByTestId('primary-badge')
      expect(badge.props.style.backgroundColor).toBe(Colors.light.primary)
    })

    it('should render with secondary variant', () => {
      render(
        <Badge
          variant="secondary"
          label="Secondary"
          testID="secondary-badge"
        />,
      )
      const badge = screen.getByTestId('secondary-badge')
      expect(badge.props.style.backgroundColor).toBe(Colors.light.secondary)
    })

    it('should render with success variant', () => {
      render(<Badge variant="success" label="Success" testID="success-badge" />)
      const badge = screen.getByTestId('success-badge')
      expect(badge.props.style.backgroundColor).toBe(Colors.light.success)
    })

    it('should render with warning variant', () => {
      render(<Badge variant="warning" label="Warning" testID="warning-badge" />)
      const badge = screen.getByTestId('warning-badge')
      expect(badge.props.style.backgroundColor).toBe(Colors.light.warning)
    })

    it('should render with error variant', () => {
      render(<Badge variant="error" label="Error" testID="error-badge" />)
      const badge = screen.getByTestId('error-badge')
      expect(badge.props.style.backgroundColor).toBe(Colors.light.error)
    })

    it('should render with info variant', () => {
      render(<Badge variant="info" label="Info" testID="info-badge" />)
      const badge = screen.getByTestId('info-badge')
      expect(badge.props.style.backgroundColor).toBe(Colors.light.white)
    })
  })

  describe('Badge Styles', () => {
    it('should render with solid style', () => {
      render(<Badge badgeStyle="solid" label="Solid" testID="solid-badge" />)
      const badge = screen.getByTestId('solid-badge')
      expect(badge.props.style.borderWidth).toBe(0)
    })

    it('should render with outline style', () => {
      render(
        <Badge badgeStyle="outline" label="Outline" testID="outline-badge" />,
      )
      const badge = screen.getByTestId('outline-badge')
      expect(badge.props.style.borderWidth).toBe(1)
    })

    it('should render with subtle style', () => {
      render(<Badge badgeStyle="subtle" label="Subtle" testID="subtle-badge" />)
      expect(screen.getByTestId('subtle-badge')).toBeTruthy()
    })
  })

  describe('Shape Variants', () => {
    it('should render with pill shape', () => {
      render(<Badge shape="pill" label="Pill" testID="pill-badge" />)
      const badge = screen.getByTestId('pill-badge')
      expect(badge.props.style.borderRadius).toBe(10)
    })

    it('should render with rounded shape', () => {
      render(<Badge shape="rounded" label="Rounded" testID="rounded-badge" />)
      const badge = screen.getByTestId('rounded-badge')
      expect(badge.props.style.borderRadius).toBe(5)
    })

    it('should render with square shape', () => {
      render(<Badge shape="square" label="Square" testID="square-badge" />)
      const badge = screen.getByTestId('square-badge')
      expect(badge.props.style.borderRadius).toBe(0)
    })
  })

  describe('Content Display', () => {
    it('should render with label', () => {
      render(<Badge label="Test Label" testID="label-badge" />)
      expect(screen.getByText('Test Label')).toBeTruthy()
    })

    it('should render with string children', () => {
      render(<Badge testID="children-badge">Child Text</Badge>)
      expect(screen.getByText('Child Text')).toBeTruthy()
    })

    it('should render with count', () => {
      render(<Badge count={5} testID="count-badge" />)
      expect(screen.getByText('5')).toBeTruthy()
    })

    it('should render count with maxCount limit', () => {
      render(<Badge count={150} maxCount={99} testID="max-count-badge" />)
      expect(screen.getByText('99+')).toBeTruthy()
    })

    it('should prioritize count over label', () => {
      render(<Badge count={10} label="Label" testID="priority-badge" />)
      expect(screen.getByText('10')).toBeTruthy()
      expect(screen.queryByText('Label')).toBeNull()
    })
  })

  describe('Icons', () => {
    const MockIcon = () => null

    it('should render with left icon', () => {
      render(
        <Badge
          leftIcon={<MockIcon />}
          label="With Icon"
          testID="left-icon-badge"
        />,
      )
      const badge = screen.getByTestId('left-icon-badge')
      expect(badge.props.children.props.children[1]).toBeTruthy()
    })

    it('should render with right icon', () => {
      render(
        <Badge
          rightIcon={<MockIcon />}
          label="With Icon"
          testID="right-icon-badge"
        />,
      )
      const badge = screen.getByTestId('right-icon-badge')
      expect(badge.props.children.props.children[4]).toBeTruthy()
    })

    it('should render with center icon only', () => {
      render(<Badge icon={<MockIcon />} testID="icon-only-badge" />)
      expect(screen.getByTestId('icon-only-badge')).toBeTruthy()
    })

    it('should render with both left and right icons', () => {
      render(
        <Badge
          leftIcon={<MockIcon />}
          rightIcon={<MockIcon />}
          label="Both Icons"
          testID="both-icons-badge"
        />,
      )
      const badge = screen.getByTestId('both-icons-badge')
      expect(badge.props.children.props.children[1]).toBeTruthy()
      expect(badge.props.children.props.children[4]).toBeTruthy()
    })
  })

  describe('Dot Indicator', () => {
    it('should not show dot by default', () => {
      render(<Badge label="No Dot" testID="no-dot-badge" />)
      const badge = screen.getByTestId('no-dot-badge')
      expect(badge.props.children.props.children[0]).toBeFalsy()
    })

    it('should show dot when showDot is true', () => {
      render(<Badge showDot label="With Dot" testID="dot-badge" />)
      const badge = screen.getByTestId('dot-badge')
      expect(badge.props.children.props.children[0]).toBeTruthy()
    })
  })

  describe('Responsive Behavior', () => {
    it('should render with responsive sizing', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: false,
        isLargePhone: false,
      })
      render(<Badge responsive label="Responsive" testID="responsive-badge" />)
      const badge = screen.getByTestId('responsive-badge')
      expect(badge.props.style.height).toBe(20)
    })

    it('should apply mobile adjustments for small phones', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: true,
        isLargePhone: false,
      })

      render(<Badge responsive label="Small" testID="small-phone-badge" />)
      const badge = screen.getByTestId('small-phone-badge')
      expect(badge.props.style.height).toBeLessThan(20)
    })

    it('should apply mobile adjustments for large phones', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: false,
        isLargePhone: true,
      })

      render(<Badge responsive label="Large" testID="large-phone-badge" />)
      const badge = screen.getByTestId('large-phone-badge')
      expect(badge.props.style.height).toBeGreaterThan(20)
    })
  })

  describe('Accessibility', () => {
    it('should have correct accessibility role', () => {
      render(<Badge label="Test" testID="accessible-badge" />)
      const badge = screen.getByTestId('accessible-badge')
      expect(badge.props.accessibilityRole).toBe('text')
    })

    it('should use label as accessibility label', () => {
      render(<Badge label="Important" testID="label-accessible-badge" />)
      const badge = screen.getByTestId('label-accessible-badge')
      expect(badge.props.accessibilityLabel).toBe('Important')
    })

    it('should use custom accessibility label', () => {
      render(
        <Badge
          label="5"
          accessibilityLabel="Five items"
          testID="custom-label-badge"
        />,
      )
      const badge = screen.getByTestId('custom-label-badge')
      expect(badge.props.accessibilityLabel).toBe('Five items')
    })

    it('should format count in accessibility label', () => {
      render(<Badge count={5} testID="count-accessible-badge" />)
      const badge = screen.getByTestId('count-accessible-badge')
      expect(badge.props.accessibilityLabel).toBe('5 notifications')
    })

    it('should have accessibility hint', () => {
      render(
        <Badge
          label="New"
          accessibilityHint="Indicates new content"
          testID="hint-badge"
        />,
      )
      const badge = screen.getByTestId('hint-badge')
      expect(badge.props.accessibilityHint).toBe('Indicates new content')
    })

    it('should have default accessibility label when no content', () => {
      render(<Badge testID="default-accessible-badge" />)
      const badge = screen.getByTestId('default-accessible-badge')
      expect(badge.props.accessibilityLabel).toBe('Badge')
    })
  })

  describe('Custom Styles', () => {
    it('should accept custom container styles', () => {
      const customStyle = { marginTop: 20 }
      render(
        <Badge
          style={customStyle}
          label="Styled"
          testID="custom-style-badge"
        />,
      )
      const badge = screen.getByTestId('custom-style-badge')
      expect(badge.props.style.marginTop).toBe(20)
    })

    it('should accept custom text styles', () => {
      const customTextStyle = { fontWeight: '700' }
      render(
        <Badge
          textStyle={customTextStyle as any}
          label="Custom Text"
          testID="custom-text-badge"
        />,
      )
      expect(screen.getByTestId('custom-text-badge')).toBeTruthy()
    })
  })
})
