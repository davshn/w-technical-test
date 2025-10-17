import { render, screen } from '@testing-library/react-native'
import { Platform, StatusBar, Text } from 'react-native'

import { SafeArea } from '../../atom'
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

describe('Rendering', () => {
  it('should render without crashing', () => {
    render(
      <SafeArea testID="safe-area">
        <Text>Content</Text>
      </SafeArea>,
    )
    expect(screen.getByTestId('safe-area')).toBeTruthy()
  })

  it('should render children', () => {
    render(
      <SafeArea testID="safe-area">
        <Text>Hello World</Text>
      </SafeArea>,
    )
    expect(screen.getByText('Hello World')).toBeTruthy()
  })

  it('should render with custom testID', () => {
    render(
      <SafeArea testID="custom-safe-area">
        <Text>Content</Text>
      </SafeArea>,
    )
    expect(screen.getByTestId('custom-safe-area')).toBeTruthy()
  })

  it('should render with default props', () => {
    render(
      <SafeArea testID="default-safe-area">
        <Text>Default</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('default-safe-area')
    expect(safeArea.props.style.flex).toBe(1)
    expect(safeArea.props.style.backgroundColor).toBe(Colors.light.background)
  })
})

describe('Variant Styles', () => {
  it('should render with default variant', () => {
    render(
      <SafeArea variant="default" testID="default-variant">
        <Text>Default</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('default-variant')
    expect(safeArea.props.style.backgroundColor).toBe(Colors.light.background)
  })

  it('should render with primary variant', () => {
    render(
      <SafeArea variant="primary" testID="primary-variant">
        <Text>Primary</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('primary-variant')
    expect(safeArea.props.style.backgroundColor).toBe(Colors.light.primary)
  })

  it('should render with secondary variant', () => {
    render(
      <SafeArea variant="secondary" testID="secondary-variant">
        <Text>Secondary</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('secondary-variant')
    expect(safeArea.props.style.backgroundColor).toBe(Colors.light.secondary)
  })

  it('should render with transparent variant', () => {
    render(
      <SafeArea variant="transparent" testID="transparent-variant">
        <Text>Transparent</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('transparent-variant')
    expect(safeArea.props.style.backgroundColor).toBe('transparent')
  })
})

describe('Background Color', () => {
  it('should apply custom backgroundColor', () => {
    render(
      <SafeArea backgroundColor="#FF0000" testID="custom-bg">
        <Text>Custom BG</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('custom-bg')
    expect(safeArea.props.style.backgroundColor).toBe('#FF0000')
  })

  it('should prioritize custom backgroundColor over variant', () => {
    render(
      <SafeArea
        variant="primary"
        backgroundColor="#00FF00"
        testID="custom-priority"
      >
        <Text>Priority</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('custom-priority')
    expect(safeArea.props.style.backgroundColor).toBe('#00FF00')
  })
})

describe('Flex Property', () => {
  it('should apply default flex value', () => {
    render(
      <SafeArea testID="default-flex">
        <Text>Flex</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('default-flex')
    expect(safeArea.props.style.flex).toBe(1)
  })

  it('should apply custom flex value', () => {
    render(
      <SafeArea flex={2} testID="custom-flex">
        <Text>Flex 2</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('custom-flex')
    expect(safeArea.props.style.flex).toBe(2)
  })

  it('should apply flex 0', () => {
    render(
      <SafeArea flex={0} testID="flex-zero">
        <Text>No Flex</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('flex-zero')
    expect(safeArea.props.style.flex).toBe(0)
  })
})

describe('Padding and Gap', () => {
  it('should have default padding', () => {
    render(
      <SafeArea testID="default-padding">
        <Text>Padding</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('default-padding')
    expect(safeArea.props.style.paddingTop).toBe(24)
  })

  it('should have default gap', () => {
    render(
      <SafeArea testID="default-gap">
        <Text>Gap</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('default-gap')
    expect(safeArea.props.style.gap).toBe(16)
  })
})

describe('Mode Variants', () => {
  beforeEach(() => {
    Platform.OS = 'android'
    StatusBar.currentHeight = 24
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render with padding mode', () => {
    render(
      <SafeArea mode="padding" testID="padding-mode">
        <Text>Padding Mode</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('padding-mode')
    expect(safeArea.props.style.paddingTop).toBe(48)
  })

  it('should render with margin mode', () => {
    render(
      <SafeArea mode="margin" testID="margin-mode">
        <Text>Margin Mode</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('margin-mode')
    expect(safeArea.props.style.marginTop).toBe(48)
  })
})

describe('Android Status Bar Handling', () => {
  beforeEach(() => {
    Platform.OS = 'android'
    StatusBar.currentHeight = 24
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should apply status bar padding on Android when includeStatusBar is true', () => {
    render(
      <SafeArea includeStatusBar testID="android-statusbar">
        <Text>Android</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('android-statusbar')
    expect(safeArea.props.style.paddingTop).toBe(48)
  })

  it('should not apply status bar padding when includeStatusBar is false', () => {
    render(
      <SafeArea includeStatusBar={false} testID="no-statusbar" edges={[]}>
        <Text>No Status Bar</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('no-statusbar')
    expect(safeArea.props.style.paddingTop).toBeUndefined()
  })

  it('should handle null status bar height', () => {
    StatusBar.currentHeight = undefined
    render(
      <SafeArea
        includeStatusBar
        testID="null-statusbar"
        edges={['bottom', 'left', 'right']}
      >
        <Text>Null Height</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('null-statusbar')
    expect(safeArea.props.style.paddingTop).toBeUndefined()
  })
})

describe('iOS Handling', () => {
  beforeEach(() => {
    Platform.OS = 'ios'
  })

  afterEach(() => {
    Platform.OS = 'android'
  })

  it('should not apply status bar padding on iOS', () => {
    render(
      <SafeArea includeStatusBar testID="ios-safe-area" edges={[]}>
        <Text>iOS</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('ios-safe-area')
    expect(safeArea.props.style.paddingTop).toBeUndefined()
  })
})

describe('Custom Styles', () => {
  it('should accept custom styles', () => {
    const customStyle = { marginTop: 20, marginBottom: 10 }
    render(
      <SafeArea style={customStyle} testID="custom-style">
        <Text>Custom</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('custom-style')
    expect(safeArea.props.style.marginTop).toBe(20)
    expect(safeArea.props.style.marginBottom).toBe(10)
  })

  it('should merge custom styles with default styles', () => {
    const customStyle = { opacity: 0.8 }
    render(
      <SafeArea style={customStyle} testID="merged-style">
        <Text>Merged</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('merged-style')
    expect(safeArea.props.style.opacity).toBe(0.8)
    expect(safeArea.props.style.flex).toBe(1)
    expect(safeArea.props.style.paddingLeft).toBe(24)
  })
})

describe('Status Bar Props', () => {
  it('should accept statusBarColor prop', () => {
    render(
      <SafeArea statusBarColor="#FF0000" testID="statusbar-color">
        <Text>Status Bar Color</Text>
      </SafeArea>,
    )
    expect(screen.getByTestId('statusbar-color')).toBeTruthy()
  })

  it('should accept statusBarStyle prop with default', () => {
    render(
      <SafeArea statusBarStyle="default" testID="statusbar-style-default">
        <Text>Default Style</Text>
      </SafeArea>,
    )
    expect(screen.getByTestId('statusbar-style-default')).toBeTruthy()
  })

  it('should accept statusBarStyle prop with light-content', () => {
    render(
      <SafeArea statusBarStyle="light-content" testID="statusbar-style-light">
        <Text>Light Style</Text>
      </SafeArea>,
    )
    expect(screen.getByTestId('statusbar-style-light')).toBeTruthy()
  })

  it('should accept statusBarStyle prop with dark-content', () => {
    render(
      <SafeArea statusBarStyle="dark-content" testID="statusbar-style-dark">
        <Text>Dark Style</Text>
      </SafeArea>,
    )
    expect(screen.getByTestId('statusbar-style-dark')).toBeTruthy()
  })
})

describe('Multiple Children', () => {
  it('should render multiple children', () => {
    render(
      <SafeArea testID="multi-children">
        <Text>Child 1</Text>
        <Text>Child 2</Text>
        <Text>Child 3</Text>
      </SafeArea>,
    )
    expect(screen.getByText('Child 1')).toBeTruthy()
    expect(screen.getByText('Child 2')).toBeTruthy()
    expect(screen.getByText('Child 3')).toBeTruthy()
  })
})

describe('ScrollView Wrapper', () => {
  it('should be wrapped in ScrollView', () => {
    const container = render(
      <SafeArea testID="scrollview-wrapper">
        <Text>Scrollable</Text>
      </SafeArea>,
    )
    expect(container).toBeTruthy()
  })
})

describe('Combined Props', () => {
  it('should handle multiple props together', () => {
    render(
      <SafeArea
        variant="primary"
        flex={2}
        mode="padding"
        includeStatusBar
        testID="combined-props"
      >
        <Text>Combined</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('combined-props')
    expect(safeArea.props.style.backgroundColor).toBe(Colors.light.primary)
    expect(safeArea.props.style.flex).toBe(2)
  })

  it('should handle variant with custom backgroundColor', () => {
    render(
      <SafeArea
        variant="secondary"
        backgroundColor="#ABCDEF"
        testID="variant-custom"
      >
        <Text>Variant Custom</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('variant-custom')
    expect(safeArea.props.style.backgroundColor).toBe('#ABCDEF')
  })
})

describe('Edge Cases', () => {
  it('should render with no children', () => {
    render(<SafeArea testID="no-children" />)
    expect(screen.getByTestId('no-children')).toBeTruthy()
  })

  it('should handle undefined style prop', () => {
    render(
      <SafeArea style={undefined} testID="undefined-style">
        <Text>Undefined Style</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('undefined-style')
    expect(safeArea.props.style.flex).toBe(1)
  })

  it('should handle empty style object', () => {
    render(
      <SafeArea style={{}} testID="empty-style">
        <Text>Empty Style</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('empty-style')
    expect(safeArea.props.style.flex).toBe(1)
  })
})

describe('Default Values', () => {
  it('should use default variant when not specified', () => {
    render(
      <SafeArea testID="default-variant-check">
        <Text>Default</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('default-variant-check')
    expect(safeArea.props.style.backgroundColor).toBe(Colors.light.background)
  })

  it('should use default mode when not specified', () => {
    Platform.OS = 'android'
    StatusBar.currentHeight = 24
    render(
      <SafeArea testID="default-mode-check">
        <Text>Default Mode</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('default-mode-check')
    expect(safeArea.props.style.paddingTop).toBe(48)
  })

  it('should use default statusBarStyle when not specified', () => {
    render(
      <SafeArea testID="default-statusbar-style">
        <Text>Default Status Bar</Text>
      </SafeArea>,
    )
    expect(screen.getByTestId('default-statusbar-style')).toBeTruthy()
  })

  it('should include status bar by default', () => {
    Platform.OS = 'android'
    StatusBar.currentHeight = 24
    render(
      <SafeArea testID="default-include-statusbar">
        <Text>Include Status Bar</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('default-include-statusbar')

    expect(safeArea.props.style.paddingTop).toBe(48)
  })
})

describe('Rest Props', () => {
  it('should pass through additional props', () => {
    render(
      <SafeArea
        testID="rest-props"
        accessible={true}
        accessibilityLabel="Safe Area"
      >
        <Text>Rest Props</Text>
      </SafeArea>,
    )
    const safeArea = screen.getByTestId('rest-props')
    expect(safeArea.props.accessible).toBe(true)
    expect(safeArea.props.accessibilityLabel).toBe('Safe Area')
  })
})
