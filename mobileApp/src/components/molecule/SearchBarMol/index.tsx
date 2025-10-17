import React, { useRef, useState } from 'react'
import { StyleSheet, TextInput as RNTextInput, ActivityIndicator } from 'react-native'
import { useThemeColor } from '../../../hooks/useThemeColor'
import type { SearchBarProps } from './SearchBarProps'
import { View, IconButton, TextInput } from '../../atom'
import { FontAwesome } from "@react-native-vector-icons/fontawesome";

const SearchIcon = ({ size, color }: { size: number; color: string }) => (
  <FontAwesome name="search" size={size} color={color} />
)

const CloseIcon = ({ size, color }: { size: number; color: string }) => (
  <FontAwesome name="rotate-right" size={size} color={color} />
)

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSearch,
  onClear,
  onFocus,
  onBlur,
  placeholder = 'Buscar productos...',
  size = 'base',
  variant = 'outlined',
  loading = false,
  disabled = false,
  showSearchButton = false,
  autoFocus = false,
  clearOnSearch = false,
  debounceTime = 300,
  responsive = false,
  containerStyle,
  testID,
  SearchIconComponent,
  ClearIconComponent,
  ...rest
}) => {
  const inputRef = useRef<RNTextInput>(null)
  const [isFocused, setIsFocused] = useState(false)
  const debounceTimer = useRef<any | null>(null)

  const primaryColor = useThemeColor({}, 'primary')
  const secondaryColor = useThemeColor({}, 'textSecondary')

  const hasValue = value && value.length > 0
  const showClearButton = hasValue && !loading && !disabled

  const handleChangeText = (text: string) => {
    onChangeText?.(text)

    if (debounceTime > 0 && onSearch) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      debounceTimer.current = setTimeout(() => {
        onSearch(text)
      }, debounceTime)
    }
  }

  const handleClear = () => {
    onChangeText?.('')
    onClear?.()
    inputRef.current?.focus()
  }

  const handleSearch = () => {
    if (onSearch && value) {
      onSearch(value)
      if (clearOnSearch) {
        handleClear()
      }
    }
  }

  const handleFocus = (e: any) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: any) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const handleSubmitEditing = () => {
    if (onSearch && value) {
      onSearch(value)
      if (clearOnSearch) {
        handleClear()
      }
    }
  }

  const renderRightIcon = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
          color={primaryColor}
        />
      )
    }

    if (showClearButton) {
      return ClearIconComponent ? (
        <ClearIconComponent size={20} color={secondaryColor} />
      ) : (
        <CloseIcon size={20} color={secondaryColor} />
      )
    }

    return null
  }

  const renderSearchButton = () => {
    if (!showSearchButton || !hasValue) return null

    return (
      <View style={styles.searchButtonContainer}>
        <IconButton
          icon={
            SearchIconComponent ? (
              <SearchIconComponent size={20} color={primaryColor} />
            ) : (
              <SearchIcon size={20} color={primaryColor} />
            )
          }
          size={size}
          onPress={handleSearch}
          disabled={disabled || loading}
          responsive={responsive}
          testID={testID ? `${testID}-search-btn` : undefined}
        />
      </View>
    )
  }

  return (
    <View
      flexDirection="row"
      alignItems="center"
      style={containerStyle}
      testID={testID ? `${testID}-container` : undefined}
    >
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={handleSubmitEditing}
          placeholder={placeholder}
          size={size}
          variant={variant}
          responsive={responsive}
          editable={!disabled}
          autoFocus={autoFocus}
          returnKeyType="search"
          leftIcon={
            SearchIconComponent ? (
              <SearchIconComponent
                size={size === 'sm' ? 18 : size === 'lg' ? 24 : 20}
                color={isFocused ? primaryColor : secondaryColor}
              />
            ) : (
              <SearchIcon
                size={size === 'sm' ? 18 : size === 'lg' ? 24 : 20}
                color={isFocused ? primaryColor : secondaryColor}
              />
            )
          }
          rightIcon={renderRightIcon()}
          onRightIconPress={showClearButton ? handleClear : undefined}
          testID={testID}
          {...rest}
        />
      </View>

      {renderSearchButton()}
    </View>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
  },
  searchButtonContainer: {
    marginLeft: 8,
  },
})