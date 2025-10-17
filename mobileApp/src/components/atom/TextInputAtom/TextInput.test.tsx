import { fireEvent, render, screen } from '@testing-library/react-native'
import { createRef } from 'react'
import { TextInput as RNTextInput, TextStyle, View } from 'react-native'

import { TextInput } from '../../atom'
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

const MockIcon = ({ name, size, color, testID }: any) => (
  <View testID={testID ?? `icon-${name}`}>{name}</View>
)

describe('TextInput Atom', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    const { useResponsive } = require('../../../hooks/useResponsive')
    useResponsive.mockReturnValue({
      isSmallPhone: false,
      isLargePhone: false,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render correctly with default props', () => {
      render(<TextInput placeholder="Test placeholder" testID="test-input" />)

      const container = screen.getByTestId('test-input-container')
      const input = screen.getByTestId('test-input')

      expect(container).toBeTruthy()
      expect(input).toBeTruthy()
      expect(input.props.placeholder).toBe('Test placeholder')
    })

    it('should have correct accessibility props', () => {
      render(
        <TextInput placeholder="Accessible input" testID="accessible-input" />,
      )

      const input = screen.getByTestId('accessible-input')

      expect(input.props.accessible).toBe(true)
      expect(input.props.accessibilityRole).toBe('text')
      expect(input.props.allowFontScaling).toBe(true)
      expect(input.props.maxFontSizeMultiplier).toBe(1.5)
    })

    it('should handle value and onChangeText correctly', () => {
      const onChangeText = jest.fn()

      render(
        <TextInput
          value="test value"
          onChangeText={onChangeText}
          testID="controlled-input"
        />,
      )

      const input = screen.getByTestId('controlled-input')

      expect(input.props.value).toBe('test value')

      fireEvent.changeText(input, 'new value')
      expect(onChangeText).toHaveBeenCalledWith('new value')
    })
  })

  describe('Size Variants', () => {
    const sizeTests = [
      { size: 'sm', expectedHeight: 40, expectedFontSize: 14 },
      { size: 'base', expectedHeight: 48, expectedFontSize: 16 },
      { size: 'lg', expectedHeight: 56, expectedFontSize: 18 },
    ] as const

    sizeTests.forEach(({ size, expectedHeight, expectedFontSize }) => {
      it(`should apply correct dimensions for ${size} size`, () => {
        render(<TextInput size={size} testID="size-test-input" />)

        const container = screen.getByTestId('size-test-input-container')
        const input = screen.getByTestId('size-test-input')

        expect(container.props.style.height).toBe(expectedHeight)
        expect(input.props.style.fontSize).toBe(expectedFontSize)
      })
    })
  })

  describe('Variant Styles', () => {
    it('should apply outlined variant styles', () => {
      render(<TextInput variant="outlined" testID="outlined-input" />)

      const container = screen.getByTestId('outlined-input-container')
      const style = container.props.style

      expect(style.borderWidth).toBe(1)
      expect(style.borderRadius).toBe(8)
      expect(style.backgroundColor).toBe(Colors.light.background)
    })

    it('should apply filled variant styles', () => {
      render(<TextInput variant="filled" testID="filled-input" />)

      const container = screen.getByTestId('filled-input-container')
      const style = container.props.style

      expect(style.backgroundColor).toBe(Colors.light.tint)
      expect(style.borderBottomWidth).toBe(2)
      expect(style.borderRadius).toBe(8)
    })

    it('should apply underlined variant styles', () => {
      render(<TextInput variant="underlined" testID="underlined-input" />)

      const container = screen.getByTestId('underlined-input-container')
      const style = container.props.style

      expect(style.backgroundColor).toBe('transparent')
      expect(style.borderBottomWidth).toBe(1)
      expect(style.paddingHorizontal).toBe(4)
    })

    it('should apply borderless variant styles', () => {
      render(<TextInput variant="borderless" testID="borderless-input" />)

      const container = screen.getByTestId('borderless-input-container')
      const style = container.props.style

      expect(style.backgroundColor).toBe('transparent')
      expect(style.paddingHorizontal).toBe(4)
    })
  })

  describe('State Management', () => {
    it('should handle focus state correctly', () => {
      render(<TextInput variant="outlined" testID="focus-input" />)

      const container = screen.getByTestId('focus-input-container')
      const input = screen.getByTestId('focus-input')

      expect(container.props.style.borderWidth).toBe(1)
      expect(container.props.style.borderColor).toBe(Colors.light.secondary)

      fireEvent(input, 'focus')

      expect(container.props.style.borderWidth).toBe(2)
      expect(container.props.style.borderColor).toBe(Colors.light.primary)
    })

    it('should handle blur state correctly', () => {
      const onBlur = jest.fn()

      render(<TextInput onBlur={onBlur} testID="blur-input" />)

      const input = screen.getByTestId('blur-input')

      fireEvent(input, 'focus')
      fireEvent(input, 'blur')

      expect(onBlur).toHaveBeenCalled()

      const container = screen.getByTestId('blur-input-container')
      expect(container.props.style.borderWidth).toBe(1)
    })

    it('should handle disabled state correctly', () => {
      render(<TextInput editable={false} testID="disabled-input" />)

      const container = screen.getByTestId('disabled-input-container')
      const input = screen.getByTestId('disabled-input')

      expect(input.props.editable).toBe(false)
      expect(input.props.accessibilityState.disabled).toBe(true)
      expect(container.props.style.backgroundColor).toBe(Colors.light.disabled)
    })

    it('should handle error state through state prop', () => {
      render(
        <TextInput state="error" variant="outlined" testID="error-input" />,
      )

      const container = screen.getByTestId('error-input-container')

      expect(container.props.style.borderColor).toBe(Colors.light.error)
    })
  })

  describe('Icon Handling', () => {
    it('should render left icon correctly', () => {
      render(
        <TextInput
          leftIcon={<MockIcon name="search" testID="left-icon" />}
          testID="left-icon-input"
        />,
      )

      const leftIcon = screen.getByTestId('left-icon')
      expect(leftIcon).toBeTruthy()
    })

    it('should render right icon correctly', () => {
      render(
        <TextInput
          rightIcon={<MockIcon name="clear" testID="right-icon" />}
          testID="right-icon-input"
        />,
      )

      const rightIcon = screen.getByTestId('right-icon')
      expect(rightIcon).toBeTruthy()
    })

    it('should handle right icon press correctly', () => {
      const onRightIconPress = jest.fn()

      render(
        <TextInput
          rightIcon={<MockIcon name="clear" />}
          onRightIconPress={onRightIconPress}
          testID="pressable-icon-input"
        />,
      )

      const rightIconButton = screen.getByTestId(
        'pressable-icon-input-right-icon-button',
      )

      fireEvent.press(rightIconButton)
      expect(onRightIconPress).toHaveBeenCalled()
    })

    it('should handle left icon press correctly', () => {
      const onLeftIconPress = jest.fn()

      render(
        <TextInput
          leftIcon={<MockIcon name="menu" />}
          onLeftIconPress={onLeftIconPress}
          testID="pressable-left-icon-input"
        />,
      )

      const leftIconButton = screen.getByTestId(
        'pressable-left-icon-input-left-icon-button',
      )

      fireEvent.press(leftIconButton)
      expect(onLeftIconPress).toHaveBeenCalled()
    })

    it('should not make icons pressable when disabled', () => {
      const onRightIconPress = jest.fn()

      render(
        <TextInput
          editable={false}
          rightIcon={<MockIcon name="clear" />}
          onRightIconPress={onRightIconPress}
          testID="disabled-icon-input"
        />,
      )

      expect(() => {
        screen.getByTestId('disabled-icon-input-right-icon-button')
      }).toThrow()
    })
  })

  describe('Responsive Behavior', () => {
    it('should adjust size for small phones when responsive is true', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: true,
        isLargePhone: false,
      })

      render(
        <TextInput size="base" responsive testID="responsive-small-input" />,
      )

      const container = screen.getByTestId('responsive-small-input-container')
      const input = screen.getByTestId('responsive-small-input')

      expect(container.props.style.height).toBe(43)
      expect(input.props.style.fontSize).toBe(14.5)
    })

    it('should adjust size for large phones when responsive is true', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: false,
        isLargePhone: true,
      })

      render(
        <TextInput size="base" responsive testID="responsive-large-input" />,
      )

      const container = screen.getByTestId('responsive-large-input-container')
      const input = screen.getByTestId('responsive-large-input')

      expect(container.props.style.height).toBe(50.5)
      expect(input.props.style.fontSize).toBe(17)
    })

    it('should not adjust size when responsive is false', () => {
      const { useResponsive } = require('../../../hooks/useResponsive')
      useResponsive.mockReturnValue({
        isSmallPhone: true,
        isLargePhone: false,
      })

      render(
        <TextInput
          size="base"
          responsive={false}
          testID="non-responsive-input"
        />,
      )

      const container = screen.getByTestId('non-responsive-input-container')
      const input = screen.getByTestId('non-responsive-input')

      expect(container.props.style.height).toBe(48)
      expect(input.props.style.fontSize).toBe(16)
    })
  })

  describe('Ref Forwarding', () => {
    it('should forward ref to TextInput correctly', () => {
      const ref = createRef<RNTextInput>()

      render(<TextInput ref={ref} testID="ref-input" />)

      expect(ref.current).toBeTruthy()

      expect(typeof ref.current?.focus).toBe('function')
      expect(typeof ref.current?.blur).toBe('function')
    })
  })

  describe('Custom Styles', () => {
    it('should merge container styles correctly', () => {
      const customContainerStyle = {
        marginBottom: 16,
        backgroundColor: 'red',
      }

      render(
        <TextInput
          containerStyle={customContainerStyle}
          testID="custom-container-input"
        />,
      )

      const container = screen.getByTestId('custom-container-input-container')

      expect(container.props.style.marginBottom).toBe(16)
      expect(container.props.style.backgroundColor).toBe('red')
    })

    it('should merge input styles correctly', () => {
      const customInputStyle = {
        fontWeight: 'bold',
        textAlign: 'center',
      } as TextStyle

      render(
        <TextInput inputStyle={customInputStyle} testID="custom-input-style" />,
      )

      const input = screen.getByTestId('custom-input-style')

      expect(input.props.style.fontWeight).toBe('bold')
      expect(input.props.style.textAlign).toBe('center')
    })
  })

  describe('Native Props', () => {
    it('should pass through native TextInput props', () => {
      render(
        <TextInput
          multiline
          numberOfLines={4}
          keyboardType="numeric"
          autoCapitalize="words"
          testID="native-props-input"
        />,
      )

      const input = screen.getByTestId('native-props-input')

      expect(input.props.multiline).toBe(true)
      expect(input.props.numberOfLines).toBe(4)
      expect(input.props.keyboardType).toBe('numeric')
      expect(input.props.autoCapitalize).toBe('words')
    })

    it('should have secure defaults for mobile', () => {
      render(<TextInput testID="secure-defaults-input" />)

      const input = screen.getByTestId('secure-defaults-input')

      expect(input.props.textContentType).toBe('none')
      expect(input.props.autoComplete).toBe('off')
      expect(input.props.autoCorrect).toBe(false)
      expect(input.props.spellCheck).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle null/undefined icons gracefully', () => {
      render(
        <TextInput
          leftIcon={null}
          rightIcon={undefined}
          testID="null-icons-input"
        />,
      )

      const container = screen.getByTestId('null-icons-input-container')
      expect(container).toBeTruthy()

      expect(() => {
        screen.getByTestId('null-icons-input-left-icon-button')
      }).toThrow()
    })

    it('should handle complex state combinations', () => {
      render(
        <TextInput
          state="error"
          editable={false}
          variant="filled"
          testID="complex-state-input"
        />,
      )

      const container = screen.getByTestId('complex-state-input-container')

      expect(container.props.style.backgroundColor).toBe(Colors.light.disabled)
    })
  })
})
