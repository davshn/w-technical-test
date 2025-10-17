import { render, screen } from '@testing-library/react-native'
import { Text } from 'react-native'

import { View } from '../../atom'
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

describe('Rendering', () => {
  it('should render without crashing', () => {
    render(
      <View testID="view">
        <Text>Content</Text>
      </View>,
    )
    expect(screen.getByTestId('view')).toBeTruthy()
  })

  it('should render children', () => {
    render(
      <View testID="view">
        <Text>Hello World</Text>
      </View>,
    )
    expect(screen.getByText('Hello World')).toBeTruthy()
  })

  it('should render with custom testID', () => {
    render(
      <View testID="custom-view">
        <Text>Content</Text>
      </View>,
    )
    expect(screen.getByTestId('custom-view')).toBeTruthy()
  })
})

describe('Variant Styles', () => {
  it('should render with default variant', () => {
    render(
      <View variant="default" testID="default-view">
        <Text>Default</Text>
      </View>,
    )
    const view = screen.getByTestId('default-view')
    expect(view).toBeTruthy()
  })

  it('should render with card variant', () => {
    render(
      <View variant="card" testID="card-view">
        <Text>Card</Text>
      </View>,
    )
    const view = screen.getByTestId('card-view')
    expect(view.props.style.backgroundColor).toBe(Colors.light.tint)
    expect(view.props.style.elevation).toBe(4)
  })

  it('should render with elevated variant', () => {
    render(
      <View variant="elevated" testID="elevated-view">
        <Text>Elevated</Text>
      </View>,
    )
    const view = screen.getByTestId('elevated-view')
    expect(view.props.style.backgroundColor).toBe(Colors.light.primary)
    expect(view.props.style.elevation).toBe(8)
  })

  it('should render with outlined variant', () => {
    render(
      <View variant="outlined" testID="outlined-view">
        <Text>Outlined</Text>
      </View>,
    )
    const view = screen.getByTestId('outlined-view')
    expect(view.props.style.backgroundColor).toBe(Colors.light.background)
    expect(view.props.style.borderWidth).toBe(1)
    expect(view.props.style.borderColor).toBe(Colors.light.secondary)
  })

  it('should render with transparent variant', () => {
    render(
      <View variant="transparent" testID="transparent-view">
        <Text>Transparent</Text>
      </View>,
    )
    const view = screen.getByTestId('transparent-view')
    expect(view.props.style.backgroundColor).toBe('transparent')
  })
})

describe('Padding Variants', () => {
  it('should apply none padding', () => {
    render(
      <View padding="none" testID="padding-none-view">
        <Text>None</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-none-view')
    expect(view.props.style.padding).toBe(0)
  })

  it('should apply xs padding', () => {
    render(
      <View padding="xs" testID="padding-xs-view">
        <Text>XS</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-xs-view')
    expect(view.props.style.padding).toBe(4)
  })

  it('should apply sm padding', () => {
    render(
      <View padding="sm" testID="padding-sm-view">
        <Text>SM</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-sm-view')
    expect(view.props.style.padding).toBe(8)
  })

  it('should apply base padding', () => {
    render(
      <View padding="base" testID="padding-base-view">
        <Text>Base</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-base-view')
    expect(view.props.style.padding).toBe(16)
  })

  it('should apply lg padding', () => {
    render(
      <View padding="lg" testID="padding-lg-view">
        <Text>LG</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-lg-view')
    expect(view.props.style.padding).toBe(24)
  })

  it('should apply xl padding', () => {
    render(
      <View padding="xl" testID="padding-xl-view">
        <Text>XL</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-xl-view')
    expect(view.props.style.padding).toBe(32)
  })

  it('should apply 2xl padding', () => {
    render(
      <View padding="2xl" testID="padding-2xl-view">
        <Text>2XL</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-2xl-view')
    expect(view.props.style.padding).toBe(48)
  })
})

describe('Directional Padding', () => {
  it('should apply paddingVertical', () => {
    render(
      <View paddingVertical="base" testID="padding-vertical-view">
        <Text>Vertical</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-vertical-view')
    expect(view.props.style.paddingVertical).toBe(16)
  })

  it('should apply paddingHorizontal', () => {
    render(
      <View paddingHorizontal="base" testID="padding-horizontal-view">
        <Text>Horizontal</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-horizontal-view')
    expect(view.props.style.paddingHorizontal).toBe(16)
  })

  it('should apply paddingTop', () => {
    render(
      <View paddingTop="lg" testID="padding-top-view">
        <Text>Top</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-top-view')
    expect(view.props.style.paddingTop).toBe(24)
  })

  it('should apply paddingBottom', () => {
    render(
      <View paddingBottom="lg" testID="padding-bottom-view">
        <Text>Bottom</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-bottom-view')
    expect(view.props.style.paddingBottom).toBe(24)
  })

  it('should apply paddingLeft', () => {
    render(
      <View paddingLeft="sm" testID="padding-left-view">
        <Text>Left</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-left-view')
    expect(view.props.style.paddingLeft).toBe(8)
  })

  it('should apply paddingRight', () => {
    render(
      <View paddingRight="sm" testID="padding-right-view">
        <Text>Right</Text>
      </View>,
    )
    const view = screen.getByTestId('padding-right-view')
    expect(view.props.style.paddingRight).toBe(8)
  })
})

describe('Margin Variants', () => {
  it('should apply none margin', () => {
    render(
      <View margin="none" testID="margin-none-view">
        <Text>None</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-none-view')
    expect(view.props.style.margin).toBe(0)
  })

  it('should apply xs margin', () => {
    render(
      <View margin="xs" testID="margin-xs-view">
        <Text>XS</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-xs-view')
    expect(view.props.style.margin).toBe(4)
  })

  it('should apply sm margin', () => {
    render(
      <View margin="sm" testID="margin-sm-view">
        <Text>SM</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-sm-view')
    expect(view.props.style.margin).toBe(8)
  })

  it('should apply base margin', () => {
    render(
      <View margin="base" testID="margin-base-view">
        <Text>Base</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-base-view')
    expect(view.props.style.margin).toBe(16)
  })

  it('should apply lg margin', () => {
    render(
      <View margin="lg" testID="margin-lg-view">
        <Text>LG</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-lg-view')
    expect(view.props.style.margin).toBe(24)
  })

  it('should apply xl margin', () => {
    render(
      <View margin="xl" testID="margin-xl-view">
        <Text>XL</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-xl-view')
    expect(view.props.style.margin).toBe(32)
  })

  it('should apply 2xl margin', () => {
    render(
      <View margin="2xl" testID="margin-2xl-view">
        <Text>2XL</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-2xl-view')
    expect(view.props.style.margin).toBe(48)
  })
})

describe('Directional Margin', () => {
  it('should apply marginVertical', () => {
    render(
      <View marginVertical="base" testID="margin-vertical-view">
        <Text>Vertical</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-vertical-view')
    expect(view.props.style.marginVertical).toBe(16)
  })

  it('should apply marginHorizontal', () => {
    render(
      <View marginHorizontal="base" testID="margin-horizontal-view">
        <Text>Horizontal</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-horizontal-view')
    expect(view.props.style.marginHorizontal).toBe(16)
  })

  it('should apply marginTop', () => {
    render(
      <View marginTop="lg" testID="margin-top-view">
        <Text>Top</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-top-view')
    expect(view.props.style.marginTop).toBe(24)
  })

  it('should apply marginBottom', () => {
    render(
      <View marginBottom="lg" testID="margin-bottom-view">
        <Text>Bottom</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-bottom-view')
    expect(view.props.style.marginBottom).toBe(24)
  })

  it('should apply marginLeft', () => {
    render(
      <View marginLeft="sm" testID="margin-left-view">
        <Text>Left</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-left-view')
    expect(view.props.style.marginLeft).toBe(8)
  })

  it('should apply marginRight', () => {
    render(
      <View marginRight="sm" testID="margin-right-view">
        <Text>Right</Text>
      </View>,
    )
    const view = screen.getByTestId('margin-right-view')
    expect(view.props.style.marginRight).toBe(8)
  })
})

describe('Radius Variants', () => {
  it('should apply none radius', () => {
    render(
      <View radius="none" testID="radius-none-view">
        <Text>None</Text>
      </View>,
    )
    const view = screen.getByTestId('radius-none-view')
    expect(view.props.style.borderRadius).toBe(0)
  })

  it('should apply xs radius', () => {
    render(
      <View radius="xs" testID="radius-xs-view">
        <Text>XS</Text>
      </View>,
    )
    const view = screen.getByTestId('radius-xs-view')
    expect(view.props.style.borderRadius).toBe(4)
  })

  it('should apply sm radius', () => {
    render(
      <View radius="sm" testID="radius-sm-view">
        <Text>SM</Text>
      </View>,
    )
    const view = screen.getByTestId('radius-sm-view')
    expect(view.props.style.borderRadius).toBe(8)
  })

  it('should apply base radius', () => {
    render(
      <View radius="base" testID="radius-base-view">
        <Text>Base</Text>
      </View>,
    )
    const view = screen.getByTestId('radius-base-view')
    expect(view.props.style.borderRadius).toBe(12)
  })

  it('should apply lg radius', () => {
    render(
      <View radius="lg" testID="radius-lg-view">
        <Text>LG</Text>
      </View>,
    )
    const view = screen.getByTestId('radius-lg-view')
    expect(view.props.style.borderRadius).toBe(16)
  })

  it('should apply xl radius', () => {
    render(
      <View radius="xl" testID="radius-xl-view">
        <Text>XL</Text>
      </View>,
    )
    const view = screen.getByTestId('radius-xl-view')
    expect(view.props.style.borderRadius).toBe(24)
  })

  it('should apply full radius', () => {
    render(
      <View radius="full" testID="radius-full-view">
        <Text>Full</Text>
      </View>,
    )
    const view = screen.getByTestId('radius-full-view')
    expect(view.props.style.borderRadius).toBe(9999)
  })
})

describe('Shadow Variants', () => {
  it('should apply none shadow', () => {
    render(
      <View shadow="none" testID="shadow-none-view">
        <Text>None</Text>
      </View>,
    )
    const view = screen.getByTestId('shadow-none-view')
    expect(view.props.style.elevation).toBeFalsy()
  })

  it('should apply sm shadow', () => {
    render(
      <View shadow="sm" testID="shadow-sm-view">
        <Text>SM</Text>
      </View>,
    )
    const view = screen.getByTestId('shadow-sm-view')
    expect(view.props.style.elevation).toBe(1)
    expect(view.props.style.shadowOpacity).toBe(0.18)
  })

  it('should apply base shadow', () => {
    render(
      <View shadow="base" testID="shadow-base-view">
        <Text>Base</Text>
      </View>,
    )
    const view = screen.getByTestId('shadow-base-view')
    expect(view.props.style.elevation).toBe(4)
    expect(view.props.style.shadowOpacity).toBe(0.23)
  })

  it('should apply lg shadow', () => {
    render(
      <View shadow="lg" testID="shadow-lg-view">
        <Text>LG</Text>
      </View>,
    )
    const view = screen.getByTestId('shadow-lg-view')
    expect(view.props.style.elevation).toBe(8)
    expect(view.props.style.shadowOpacity).toBe(0.3)
  })

  it('should apply xl shadow', () => {
    render(
      <View shadow="xl" testID="shadow-xl-view">
        <Text>XL</Text>
      </View>,
    )
    const view = screen.getByTestId('shadow-xl-view')
    expect(view.props.style.elevation).toBe(16)
    expect(view.props.style.shadowOpacity).toBe(0.44)
  })
})

describe('Custom Colors', () => {
  it('should apply custom backgroundColor', () => {
    render(
      <View backgroundColor="#FF0000" testID="custom-bg-view">
        <Text>Custom BG</Text>
      </View>,
    )
    const view = screen.getByTestId('custom-bg-view')
    expect(view.props.style.backgroundColor).toBe('#FF0000')
  })

  it('should apply custom borderColor', () => {
    render(
      <View borderColor="#00FF00" borderWidth={2} testID="custom-border-view">
        <Text>Custom Border</Text>
      </View>,
    )
    const view = screen.getByTestId('custom-border-view')
    expect(view.props.style.borderColor).toBe('#00FF00')
  })

  it('should apply custom shadowColor', () => {
    render(
      <View shadow="base" shadowColor="#0000FF" testID="custom-shadow-view">
        <Text>Custom Shadow</Text>
      </View>,
    )
    const view = screen.getByTestId('custom-shadow-view')
    expect(view.props.style.shadowColor).toBe('#0000FF')
  })

  it('should apply custom borderWidth', () => {
    render(
      <View borderWidth={3} testID="custom-border-width-view">
        <Text>Custom Border Width</Text>
      </View>,
    )
    const view = screen.getByTestId('custom-border-width-view')
    expect(view.props.style.borderWidth).toBe(3)
  })
})

describe('Flexbox Properties', () => {
  it('should apply flex property', () => {
    render(
      <View flex={1} testID="flex-view">
        <Text>Flex</Text>
      </View>,
    )
    const view = screen.getByTestId('flex-view')
    expect(view.props.style.flex).toBe(1)
  })

  it('should apply flexDirection row', () => {
    render(
      <View flexDirection="row" testID="flex-direction-view">
        <Text>Row</Text>
      </View>,
    )
    const view = screen.getByTestId('flex-direction-view')
    expect(view.props.style.flexDirection).toBe('row')
  })

  it('should apply justifyContent center', () => {
    render(
      <View justifyContent="center" testID="justify-content-view">
        <Text>Center</Text>
      </View>,
    )
    const view = screen.getByTestId('justify-content-view')
    expect(view.props.style.justifyContent).toBe('center')
  })

  it('should apply alignItems center', () => {
    render(
      <View alignItems="center" testID="align-items-view">
        <Text>Center</Text>
      </View>,
    )
    const view = screen.getByTestId('align-items-view')
    expect(view.props.style.alignItems).toBe('center')
  })

  it('should apply alignSelf center', () => {
    render(
      <View alignSelf="center" testID="align-self-view">
        <Text>Center</Text>
      </View>,
    )
    const view = screen.getByTestId('align-self-view')
    expect(view.props.style.alignSelf).toBe('center')
  })
})

describe('Dimension Properties', () => {
  it('should apply width', () => {
    render(
      <View width={200} testID="width-view">
        <Text>Width</Text>
      </View>,
    )
    const view = screen.getByTestId('width-view')
    expect(view.props.style.width).toBe(200)
  })

  it('should apply height', () => {
    render(
      <View height={100} testID="height-view">
        <Text>Height</Text>
      </View>,
    )
    const view = screen.getByTestId('height-view')
    expect(view.props.style.height).toBe(100)
  })

  it('should apply percentage width', () => {
    render(
      <View width="50%" testID="percentage-width-view">
        <Text>50% Width</Text>
      </View>,
    )
    const view = screen.getByTestId('percentage-width-view')
    expect(view.props.style.width).toBe('50%')
  })

  it('should apply percentage height', () => {
    render(
      <View height="100%" testID="percentage-height-view">
        <Text>100% Height</Text>
      </View>,
    )
    const view = screen.getByTestId('percentage-height-view')
    expect(view.props.style.height).toBe('100%')
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
      <View responsive padding="base" testID="responsive-view">
        <Text>Responsive</Text>
      </View>,
    )
    const view = screen.getByTestId('responsive-view')
    expect(view.props.style.padding).toBe(16)
  })

  it('should apply mobile adjustments for small phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <View responsive padding="base" testID="small-phone-view">
        <Text>Small</Text>
      </View>,
    )
    const view = screen.getByTestId('small-phone-view')
    expect(view.props.style.padding).toBeLessThan(16)
  })

  it('should apply mobile adjustments for large phones', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: true,
    })

    render(
      <View responsive padding="base" testID="large-phone-view">
        <Text>Large</Text>
      </View>,
    )
    const view = screen.getByTestId('large-phone-view')
    expect(view.props.style.padding).toBeGreaterThan(16)
  })

  it('should not apply responsive adjustments when responsive is false', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <View responsive={false} padding="base" testID="non-responsive-view">
        <Text>Non Responsive</Text>
      </View>,
    )
    const view = screen.getByTestId('non-responsive-view')
    expect(view.props.style.padding).toBe(16)
  })

  it('should not apply responsive adjustments to none padding', () => {
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: true,
      isLargePhone: false,
    })

    render(
      <View responsive padding="none" testID="none-padding-responsive-view">
        <Text>None Padding</Text>
      </View>,
    )
    const view = screen.getByTestId('none-padding-responsive-view')
    expect(view.props.style.padding).toBe(0)
  })
})

describe('Custom Styles', () => {
  it('should accept custom container styles', () => {
    const customStyle = { opacity: 0.8 }
    render(
      <View style={customStyle} testID="custom-style-view">
        <Text>Styled</Text>
      </View>,
    )
    const view = screen.getByTestId('custom-style-view')
    expect(view.props.style.opacity).toBe(0.8)
  })

  it('should merge custom styles with props', () => {
    const customStyle = { opacity: 0.5 }
    render(
      <View padding="base" style={customStyle} testID="merged-style-view">
        <Text>Merged</Text>
      </View>,
    )
    const view = screen.getByTestId('merged-style-view')
    expect(view.props.style.opacity).toBe(0.5)
    expect(view.props.style.padding).toBe(16)
  })
})

describe('Combined Properties', () => {
  it('should apply multiple padding properties', () => {
    render(
      <View
        paddingTop="lg"
        paddingBottom="sm"
        paddingLeft="xs"
        paddingRight="base"
        testID="multi-padding-view"
      >
        <Text>Multi Padding</Text>
      </View>,
    )
    const view = screen.getByTestId('multi-padding-view')
    expect(view.props.style.paddingTop).toBe(24)
    expect(view.props.style.paddingBottom).toBe(8)
    expect(view.props.style.paddingLeft).toBe(4)
    expect(view.props.style.paddingRight).toBe(16)
  })

  it('should apply multiple margin properties', () => {
    render(
      <View
        marginTop="xl"
        marginBottom="base"
        marginLeft="sm"
        marginRight="lg"
        testID="multi-margin-view"
      >
        <Text>Multi Margin</Text>
      </View>,
    )
    const view = screen.getByTestId('multi-margin-view')
    expect(view.props.style.marginTop).toBe(32)
    expect(view.props.style.marginBottom).toBe(16)
    expect(view.props.style.marginLeft).toBe(8)
    expect(view.props.style.marginRight).toBe(24)
  })

  it('should apply complex layout combination', () => {
    render(
      <View
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        padding="base"
        margin="lg"
        testID="complex-layout-view"
      >
        <Text>Complex</Text>
      </View>,
    )
    const view = screen.getByTestId('complex-layout-view')
    expect(view.props.style.flex).toBe(1)
    expect(view.props.style.flexDirection).toBe('row')
    expect(view.props.style.justifyContent).toBe('space-between')
    expect(view.props.style.alignItems).toBe('center')
    expect(view.props.style.padding).toBe(16)
    expect(view.props.style.margin).toBe(24)
  })
})

describe('Variant with Custom Props', () => {
  it('should override card variant background color', () => {
    render(
      <View
        variant="card"
        backgroundColor="#FF5733"
        testID="card-override-view"
      >
        <Text>Override</Text>
      </View>,
    )
    const view = screen.getByTestId('card-override-view')
    expect(view.props.style.backgroundColor).toBe('#FF5733')
  })

  it('should override outlined variant border properties', () => {
    render(
      <View
        variant="outlined"
        borderColor="#00FF00"
        borderWidth={3}
        testID="outlined-override-view"
      >
        <Text>Override</Text>
      </View>,
    )
    const view = screen.getByTestId('outlined-override-view')
    expect(view.props.style.borderColor).toBe('#00FF00')
    expect(view.props.style.borderWidth).toBe(3)
  })
})
