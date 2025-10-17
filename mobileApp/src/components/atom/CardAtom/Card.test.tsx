import { fireEvent, render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'

import { Card } from '../../atom'

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

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Rendering', () => {
  it('should render without crashing', () => {
    render(
      <Card testID="card">
        <Text>Content</Text>
      </Card>,
    )
    expect(screen.getByTestId('card')).toBeTruthy()
  })

  it('should render with default props', () => {
    render(
      <Card testID="default-card">
        <Text>Default Content</Text>
      </Card>,
    )
    const card = screen.getByTestId('default-card')
    expect(card).toBeTruthy()
    expect(screen.getByText('Default Content')).toBeTruthy()
  })

  it('should render with custom testID', () => {
    render(
      <Card testID="custom-card">
        <Text>Content</Text>
      </Card>,
    )
    expect(screen.getByTestId('custom-card')).toBeTruthy()
  })

  it('should render children content', () => {
    render(
      <Card testID="children-card">
        <Text>Child 1</Text>
        <Text>Child 2</Text>
      </Card>,
    )
    expect(screen.getByText('Child 1')).toBeTruthy()
    expect(screen.getByText('Child 2')).toBeTruthy()
  })
})

describe('Variant Styles', () => {
  it('should render with elevated variant', () => {
    render(
      <Card variant="elevated" testID="elevated-card">
        <Text>Elevated</Text>
      </Card>,
    )
    const card = screen.getByTestId('elevated-card')
    expect(card.props.style.elevation).toBeGreaterThan(0)
  })

  it('should render with outlined variant', () => {
    render(
      <Card variant="outlined" testID="outlined-card">
        <Text>Outlined</Text>
      </Card>,
    )
    const card = screen.getByTestId('outlined-card')
    expect(card.props.style.borderWidth).toBe(1)
  })

  it('should render with filled variant', () => {
    render(
      <Card variant="filled" testID="filled-card">
        <Text>Filled</Text>
      </Card>,
    )
    expect(screen.getByTestId('filled-card')).toBeTruthy()
  })

  it('should render with ghost variant', () => {
    render(
      <Card variant="ghost" testID="ghost-card">
        <Text>Ghost</Text>
      </Card>,
    )
    expect(screen.getByTestId('ghost-card')).toBeTruthy()
  })
})

describe('Padding Options', () => {
  it('should render with none padding', () => {
    render(
      <Card padding="none" testID="none-padding-card">
        <Text>No Padding</Text>
      </Card>,
    )
    const card = screen.getByTestId('none-padding-card')
    expect(card.props.style.padding).toBe(0)
  })

  it('should render with xs padding', () => {
    render(
      <Card padding="xs" testID="xs-padding-card">
        <Text>XS Padding</Text>
      </Card>,
    )
    const card = screen.getByTestId('xs-padding-card')
    expect(card.props.style.padding).toBe(8)
  })

  it('should render with sm padding', () => {
    render(
      <Card padding="sm" testID="sm-padding-card">
        <Text>SM Padding</Text>
      </Card>,
    )
    const card = screen.getByTestId('sm-padding-card')
    expect(card.props.style.padding).toBe(12)
  })

  it('should render with base padding', () => {
    render(
      <Card padding="base" testID="base-padding-card">
        <Text>Base Padding</Text>
      </Card>,
    )
    const card = screen.getByTestId('base-padding-card')
    expect(card.props.style.padding).toBe(16)
  })

  it('should render with lg padding', () => {
    render(
      <Card padding="lg" testID="lg-padding-card">
        <Text>LG Padding</Text>
      </Card>,
    )
    const card = screen.getByTestId('lg-padding-card')
    expect(card.props.style.padding).toBe(20)
  })

  it('should render with xl padding', () => {
    render(
      <Card padding="xl" testID="xl-padding-card">
        <Text>XL Padding</Text>
      </Card>,
    )
    const card = screen.getByTestId('xl-padding-card')
    expect(card.props.style.padding).toBe(24)
  })
})

describe('Radius Options', () => {
  it('should render with none radius', () => {
    render(
      <Card radius="none" testID="none-radius-card">
        <Text>No Radius</Text>
      </Card>,
    )
    const card = screen.getByTestId('none-radius-card')
    expect(card.props.style.borderRadius).toBe(0)
  })

  it('should render with xs radius', () => {
    render(
      <Card radius="xs" testID="xs-radius-card">
        <Text>XS Radius</Text>
      </Card>,
    )
    const card = screen.getByTestId('xs-radius-card')
    expect(card.props.style.borderRadius).toBe(4)
  })

  it('should render with sm radius', () => {
    render(
      <Card radius="sm" testID="sm-radius-card">
        <Text>SM Radius</Text>
      </Card>,
    )
    const card = screen.getByTestId('sm-radius-card')
    expect(card.props.style.borderRadius).toBe(8)
  })

  it('should render with base radius', () => {
    render(
      <Card radius="base" testID="base-radius-card">
        <Text>Base Radius</Text>
      </Card>,
    )
    const card = screen.getByTestId('base-radius-card')
    expect(card.props.style.borderRadius).toBe(12)
  })

  it('should render with lg radius', () => {
    render(
      <Card radius="lg" testID="lg-radius-card">
        <Text>LG Radius</Text>
      </Card>,
    )
    const card = screen.getByTestId('lg-radius-card')
    expect(card.props.style.borderRadius).toBe(16)
  })

  it('should render with xl radius', () => {
    render(
      <Card radius="xl" testID="xl-radius-card">
        <Text>XL Radius</Text>
      </Card>,
    )
    const card = screen.getByTestId('xl-radius-card')
    expect(card.props.style.borderRadius).toBe(20)
  })

  it('should render with full radius', () => {
    render(
      <Card radius="full" testID="full-radius-card">
        <Text>Full Radius</Text>
      </Card>,
    )
    const card = screen.getByTestId('full-radius-card')
    expect(card.props.style.borderRadius).toBe(9999)
  })
})

describe('Shadow Options', () => {
  it('should render with none shadow', () => {
    render(
      <Card shadow="none" testID="none-shadow-card">
        <Text>No Shadow</Text>
      </Card>,
    )
    const card = screen.getByTestId('none-shadow-card')
    expect(card.props.style.elevation).toBe(0)
  })

  it('should render with sm shadow', () => {
    render(
      <Card shadow="sm" testID="sm-shadow-card">
        <Text>SM Shadow</Text>
      </Card>,
    )
    const card = screen.getByTestId('sm-shadow-card')
    expect(card.props.style.elevation).toBe(1)
  })

  it('should render with base shadow', () => {
    render(
      <Card shadow="base" testID="base-shadow-card">
        <Text>Base Shadow</Text>
      </Card>,
    )
    const card = screen.getByTestId('base-shadow-card')
    expect(card.props.style.elevation).toBe(4)
  })

  it('should render with lg shadow', () => {
    render(
      <Card shadow="lg" testID="lg-shadow-card">
        <Text>LG Shadow</Text>
      </Card>,
    )
    const card = screen.getByTestId('lg-shadow-card')
    expect(card.props.style.elevation).toBe(8)
  })

  it('should render with xl shadow', () => {
    render(
      <Card shadow="xl" testID="xl-shadow-card">
        <Text>XL Shadow</Text>
      </Card>,
    )
    const card = screen.getByTestId('xl-shadow-card')
    expect(card.props.style.elevation).toBe(16)
  })
})

describe('Color Customization', () => {
  it('should render with custom background color', () => {
    render(
      <Card backgroundColor="#FF0000" testID="custom-bg-card">
        <Text>Custom BG</Text>
      </Card>,
    )
    const card = screen.getByTestId('custom-bg-card')
    expect(card.props.style.backgroundColor).toBe('#FF0000')
  })

  it('should render with custom border color', () => {
    render(
      <Card
        variant="outlined"
        borderColor="#00FF00"
        testID="custom-border-card"
      >
        <Text>Custom Border</Text>
      </Card>,
    )
    const card = screen.getByTestId('custom-border-card')
    expect(card.props.style.borderColor).toBe('#00FF00')
  })

  it('should render with custom border width', () => {
    render(
      <Card
        variant="outlined"
        borderWidth={3}
        testID="custom-border-width-card"
      >
        <Text>Custom Border Width</Text>
      </Card>,
    )
    const card = screen.getByTestId('custom-border-width-card')
    expect(card.props.style.borderWidth).toBe(3)
  })

  it('should render with custom shadow color', () => {
    render(
      <Card
        variant="elevated"
        shadowColor="#0000FF"
        testID="custom-shadow-card"
      >
        <Text>Custom Shadow</Text>
      </Card>,
    )
    const card = screen.getByTestId('custom-shadow-card')
    expect(card.props.style.shadowColor).toBe('#0000FF')
  })
})

describe('Interaction Handling', () => {
  it('should handle onPress event when pressable', () => {
    const onPress = jest.fn()
    render(
      <Card pressable onPress={onPress} testID="pressable-card">
        <Text>Press Me</Text>
      </Card>,
    )
    fireEvent.press(screen.getByTestId('pressable-card'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should handle onLongPress event', () => {
    const onLongPress = jest.fn()
    render(
      <Card pressable onLongPress={onLongPress} testID="long-press-card">
        <Text>Long Press Me</Text>
      </Card>,
    )
    fireEvent(screen.getByTestId('long-press-card'), 'longPress')
    expect(onLongPress).toHaveBeenCalledTimes(1)
  })

  it('should not trigger onPress when disabled', () => {
    const onPress = jest.fn()
    render(
      <Card pressable onPress={onPress} disabled testID="disabled-press-card">
        <Text>Disabled</Text>
      </Card>,
    )
    fireEvent.press(screen.getByTestId('disabled-press-card'))
    expect(onPress).not.toHaveBeenCalled()
  })

  it('should be pressable when onPress is provided', () => {
    const onPress = jest.fn()
    render(
      <Card onPress={onPress} testID="auto-pressable-card">
        <Text>Auto Pressable</Text>
      </Card>,
    )
    fireEvent.press(screen.getByTestId('auto-pressable-card'))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('should render as View when not interactive', () => {
    render(
      <Card testID="static-card">
        <Text>Static</Text>
      </Card>,
    )
    const card = screen.getByTestId('static-card')
    expect(card.props.accessibilityRole).toBe('none')
  })

  it('should render as Pressable when interactive', () => {
    render(
      <Card
        pressable
        onPress={() => {
          /* Empty*/
        }}
        testID="interactive-card"
      >
        <Text>Interactive</Text>
      </Card>,
    )
    const card = screen.getByTestId('interactive-card')
    expect(card.props.accessibilityRole).toBe('button')
  })
})

describe('Active Opacity', () => {
  it('should use default active opacity', () => {
    render(
      <Card
        pressable
        onPress={() => {
          /* Empty*/
        }}
        testID="default-opacity-card"
      >
        <Text>Default Opacity</Text>
      </Card>,
    )
    expect(screen.getByTestId('default-opacity-card')).toBeTruthy()
  })

  it('should use custom active opacity', () => {
    render(
      <Card
        pressable
        onPress={() => {
          /* Empty*/
        }}
        activeOpacity={0.5}
        testID="custom-opacity-card"
      >
        <Text>Custom Opacity</Text>
      </Card>,
    )
    expect(screen.getByTestId('custom-opacity-card')).toBeTruthy()
  })
})
