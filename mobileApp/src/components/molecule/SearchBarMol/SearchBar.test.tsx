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

  it('debe renderizar correctamente', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Buscar productos..."
        testID="search-bar"
      />,
    )

    expect(getByPlaceholderText('Buscar productos...')).toBeTruthy()
  })

  it('debe mostrar el valor actual', () => {
    const { getByDisplayValue } = render(
      <SearchBar
        value="laptop"
        onChangeText={mockOnChangeText}
        testID="search-bar"
      />,
    )

    expect(getByDisplayValue('laptop')).toBeTruthy()
  })

  it('debe llamar onChangeText cuando el usuario escribe', () => {
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

  it('debe ejecutar búsqueda con debounce automático', async () => {
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

  it('debe mostrar el input correctamente cuando hay texto', () => {
    const { getByTestId } = render(
      <SearchBar
        value="laptop"
        onChangeText={mockOnChangeText}
        testID="search-bar"
      />,
    )

    expect(getByTestId('search-bar')).toBeTruthy()
  })

  it('debe limpiar el texto cuando se presiona el botón clear', () => {
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

  it('debe mostrar el componente cuando loading es true', () => {
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

  it('debe ejecutar búsqueda al presionar Enter', () => {
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

  it('debe mostrar botón de búsqueda cuando showSearchButton es true', () => {
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

  it('debe llamar onSearch cuando se presiona el botón de búsqueda', () => {
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

  it('debe limpiar después de buscar cuando clearOnSearch es true', () => {
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

  it('debe manejar input vacío correctamente', () => {
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

  it('debe mostrar el placeholder correcto', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        value=""
        onChangeText={mockOnChangeText}
        placeholder="Buscar en el catálogo"
        testID="search-bar"
      />,
    )

    expect(getByPlaceholderText('Buscar en el catálogo')).toBeTruthy()
  })
})