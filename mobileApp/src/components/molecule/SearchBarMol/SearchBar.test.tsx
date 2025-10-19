jest.mock('react-native-vector-icons/FontAwesome', () => {
  return function MockFontAwesome(props:any) {
    const React = require('react')
    const { Text } = require('react-native')
    return React.createElement(Text, {
      ...props,
      testID: props.testID || `icon-${props.name}`,
    }, `MockIcon-${props.name}`)
  }
})

import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { SearchBar } from './index'

describe('SearchBar - Integration Tests', () => {
  const mockOnChangeText = jest.fn()
  const mockOnSearch = jest.fn()
  const mockOnClear = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render correctly', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Search products..."
        testID="search-bar"
      />,
    )

    expect(getByPlaceholderText('Search products...')).toBeTruthy()
  })

  it('should display the current value', () => {
    const { getByDisplayValue } = render(
      <SearchBar
        value="laptop"
        onChangeText={mockOnChangeText}
        testID="search-bar"
      />,
    )

    expect(getByDisplayValue('laptop')).toBeTruthy()
  })

  it('should call onChangeText when user types', () => {
    const { getByTestId } = render(
      <SearchBar
        value=""
        onChangeText={mockOnChangeText}
        testID="search-bar"
      />,
    )

    const input = getByTestId('search-bar')
    fireEvent.changeText(input, 'gaming')

    expect(mockOnChangeText).toHaveBeenCalledWith('gaming')
  })

  it('should execute search with automatic debounce', async () => {
    const { getByTestId } = render(
      <SearchBar
        value=""
        onChangeText={mockOnChangeText}
        onSearch={mockOnSearch}
        debounceTime={300}
        testID="search-bar"
      />,
    )

    const input = getByTestId('search-bar')
    fireEvent.changeText(input, 'laptop')

    expect(mockOnSearch).not.toHaveBeenCalled()

    jest.advanceTimersByTime(300)

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('laptop')
    })
  })

  it('should display the input correctly when there is text', () => {
    const { getByTestId } = render(
      <SearchBar
        value="laptop"
        onChangeText={mockOnChangeText}
        testID="search-bar"
      />,
    )

    expect(getByTestId('search-bar')).toBeTruthy()
  })

  it('should clear text when clear button is pressed', () => {
    const { getByTestId } = render(
      <SearchBar
        value="laptop"
        onChangeText={mockOnChangeText}
        onClear={mockOnClear}
        testID="search-bar"
      />,
    )

    const clearButton = getByTestId('search-bar-right-icon-button')
    fireEvent.press(clearButton)

    expect(mockOnChangeText).toHaveBeenCalledWith('')
    expect(mockOnClear).toHaveBeenCalled()
  })

  it('should display the component when loading is true', () => {
    const { getByTestId } = render(
      <SearchBar
        value="laptop"
        onChangeText={mockOnChangeText}
        loading
        testID="search-bar"
      />,
    )

    expect(getByTestId('search-bar')).toBeTruthy()
  })

  it('should execute search when pressing Enter', () => {
    const { getByTestId } = render(
      <SearchBar
        value="laptop"
        onChangeText={mockOnChangeText}
        onSearch={mockOnSearch}
        testID="search-bar"
      />,
    )

    const input = getByTestId('search-bar')
    fireEvent(input, 'submitEditing')

    expect(mockOnSearch).toHaveBeenCalledWith('laptop')
  })

  it('should show search button when showSearchButton is true', () => {
    const { getByTestId } = render(
      <SearchBar
        value="laptop"
        onChangeText={mockOnChangeText}
        onSearch={mockOnSearch}
        showSearchButton
        testID="search-bar"
      />,
    )

    const searchButton = getByTestId('search-bar-search-btn')
    expect(searchButton).toBeTruthy()
  })

  it('should call onSearch when search button is pressed', () => {
    const { getByTestId } = render(
      <SearchBar
        value="laptop"
        onChangeText={mockOnChangeText}
        onSearch={mockOnSearch}
        showSearchButton
        testID="search-bar"
      />,
    )

    const searchButton = getByTestId('search-bar-search-btn')
    fireEvent.press(searchButton)

    expect(mockOnSearch).toHaveBeenCalledWith('laptop')
  })

  it('should clear after searching when clearOnSearch is true', () => {
    const { getByTestId } = render(
      <SearchBar
        value="laptop"
        onChangeText={mockOnChangeText}
        onSearch={mockOnSearch}
        clearOnSearch
        testID="search-bar"
      />,
    )

    const input = getByTestId('search-bar')
    fireEvent(input, 'submitEditing')

    expect(mockOnSearch).toHaveBeenCalledWith('laptop')
    expect(mockOnChangeText).toHaveBeenCalledWith('')
  })

  it('should handle empty input correctly', () => {
    const { getByTestId } = render(
      <SearchBar
        value=""
        onChangeText={mockOnChangeText}
        disabled={false}
        testID="search-bar"
      />,
    )

    const input = getByTestId('search-bar')
    fireEvent.changeText(input, 'laptop')

    expect(mockOnChangeText).toHaveBeenCalledWith('laptop')
  })

  it('should display the correct placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Search in catalog"
        testID="search-bar"
      />,
    )

    expect(getByPlaceholderText('Search in catalog')).toBeTruthy()
  })
})