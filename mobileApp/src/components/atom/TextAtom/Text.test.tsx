import { render, screen } from '@testing-library/react-native'

import { Text } from '../../atom'
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

describe('Text Atom', () => {
  it('should render children correctly', async () => {
    render(<Text testID="test-text">Hello World</Text>)

    const textElement = screen.getByTestId('test-text')
    expect(textElement).toBeTruthy()
    expect(textElement.props.children).toBe('Hello World')
  })

  it('should have correct accessibility props', () => {
    render(<Text testID="test-text">Accessible text</Text>)

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.accessible).toBe(true)
    expect(textElement.props.accessibilityRole).toBe('text')
  })

  it('should merge custom styles with component styles', () => {
    const customStyle = { marginTop: 10, letterSpacing: 1 }

    render(
      <Text style={customStyle} size="lg" testID="test-text">
        Custom styled text
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')

    expect(textElement.props.style.fontSize).toBe(18)

    expect(textElement.props.style.marginTop).toBe(10)
    expect(textElement.props.style.letterSpacing).toBe(1)
  })

  it('should pass through native Text props', () => {
    render(
      <Text
        testID="test-text"
        numberOfLines={2}
        ellipsizeMode="tail"
        selectable={true}
      >
        Native props text
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.numberOfLines).toBe(2)
    expect(textElement.props.ellipsizeMode).toBe('tail')
    expect(textElement.props.selectable).toBe(true)
  })

  it('should apply default values when no props are provided', () => {
    render(<Text testID="test-text">Default text</Text>)

    const textElement = screen.getByTestId('test-text')

    expect(textElement.props.style.fontSize).toBe(16)
    expect(textElement.props.style.fontWeight).toBe('400')
    expect(textElement.props.style.color).toBe(Colors.light.textPrimary)
    expect(textElement.props.style.textAlign).toBe('left')
    expect(textElement.props.style.fontStyle).toBe('normal')
    expect(textElement.props.style.textDecorationLine).toBe('none')
  })

  it('should handle complex prop combinations', () => {
    render(
      <Text
        size="xl"
        weight="bold"
        color="error"
        align="center"
        italic
        underline
        testID="test-text"
      >
        Complex text
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')

    expect(textElement.props.style.fontSize).toBe(20)
    expect(textElement.props.style.fontWeight).toBe('700')
    expect(textElement.props.style.color).toBe(Colors.light.error)
    expect(textElement.props.style.textAlign).toBe('center')
    expect(textElement.props.style.fontStyle).toBe('italic')
    expect(textElement.props.style.textDecorationLine).toBe('underline')
  })
})

describe('Size variants', () => {
  const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const
  const expectedSizes = [12, 14, 16, 18, 20, 24, 30]

  sizes.forEach((size, index) => {
    it(`should apply correct fontSize for ${size} size`, () => {
      render(
        <Text size={size} testID="test-text">
          Text with {size} size
        </Text>,
      )

      const textElement = screen.getByTestId('test-text')
      expect(textElement.props.style.fontSize).toBe(expectedSizes[index])
    })
  })
})

describe('Font weights', () => {
  const weights = ['light', 'normal', 'medium', 'semibold', 'bold'] as const
  const expectedWeights = ['300', '400', '500', '600', '700']

  weights.forEach((weight, index) => {
    it(`should apply correct fontWeight for ${weight}`, () => {
      render(
        <Text weight={weight} testID="test-text">
          Text with {weight} weight
        </Text>,
      )

      const textElement = screen.getByTestId('test-text')
      expect(textElement.props.style.fontWeight).toBe(expectedWeights[index])
    })
  })
})

describe('Color variants', () => {
  const colors = {
    primary: Colors.light.textPrimary,
    secondary: Colors.light.textSecondary,
    success: Colors.light.success,
    warning: Colors.light.warning,
    error: Colors.light.error,
    muted: Colors.light.disabled,
    white: Colors.light.white,
  }

  Object.entries(colors).forEach(([colorName, expectedColor]) => {
    it(`should apply correct color for ${colorName}`, () => {
      render(
        <Text color={colorName as any} testID="test-text">
          {colorName} text
        </Text>,
      )

      const textElement = screen.getByTestId('test-text')
      expect(textElement.props.style.color).toBe(expectedColor)
    })
  })
})

describe('Text alignment', () => {
  const alignments = ['left', 'center', 'right', 'justify'] as const

  alignments.forEach((align) => {
    it(`should apply correct textAlign for ${align}`, () => {
      render(
        <Text align={align} testID="test-text">
          {align} aligned text
        </Text>,
      )

      const textElement = screen.getByTestId('test-text')
      expect(textElement.props.style.textAlign).toBe(align)
    })
  })
})

describe('Text decorations', () => {
  it('should apply italic style', () => {
    render(
      <Text italic testID="test-text">
        Italic text
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.style.fontStyle).toBe('italic')
  })

  it('should apply underline decoration', () => {
    render(
      <Text underline testID="test-text">
        Underlined text
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.style.textDecorationLine).toBe('underline')
  })

  it('should apply strikethrough decoration', () => {
    render(
      <Text strikethrough testID="test-text">
        Strikethrough text
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.style.textDecorationLine).toBe('line-through')
  })

  it('should apply both underline and strikethrough', () => {
    render(
      <Text underline strikethrough testID="test-text">
        Both decorations
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.style.textDecorationLine).toBe(
      'underline line-through',
    )
  })
})

describe('Responsive behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should apply smaller font size on small phones when responsive is true', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <Text size="base" responsive testID="test-text">
        Small phone text
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.style.fontSize).toBe(14.5)
  })

  it('should apply regular font size on regular phones when responsive is true', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: false,
    })

    render(
      <Text size="base" responsive testID="test-text">
        Regular phone text
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.style.fontSize).toBe(16)
  })

  it('should apply larger font size on large phones when responsive is true', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: true,
    })

    render(
      <Text size="base" responsive testID="test-text">
        Large phone text
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.style.fontSize).toBe(17)
  })

  it('should not apply responsive adjustments when responsive is false', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <Text size="base" responsive={false} testID="test-text">
        Non-responsive text
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.style.fontSize).toBe(16)
  })

  it('should use default responsive value (false) when not specified', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <Text size="base" testID="test-text">
        Default responsive text
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.style.fontSize).toBe(16)
  })
})

describe('Line height calculation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should calculate correct line height for responsive font sizes', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <Text size="base" responsive testID="test-text">
        Text with line height
      </Text>,
    )

    const textElement = screen.getByTestId('test-text')
    expect(textElement.props.style.lineHeight).toBe(20.5)
  })
})
