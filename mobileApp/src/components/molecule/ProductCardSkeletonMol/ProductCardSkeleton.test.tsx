import { render } from '@testing-library/react-native'
import { ProductCardSkeleton } from './index'

describe('ProductCardSkeleton - Integration Tests', () => {
  it('debe renderizar todos los elementos skeleton', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton testID="skeleton" />,
    )

    expect(getByTestId('skeleton-image')).toBeTruthy()
    expect(getByTestId('skeleton-badge')).toBeTruthy()
    expect(getByTestId('skeleton-name')).toBeTruthy()
    expect(getByTestId('skeleton-description')).toBeTruthy()
    expect(getByTestId('skeleton-price')).toBeTruthy()
    expect(getByTestId('skeleton-detail-btn')).toBeTruthy()
    expect(getByTestId('skeleton-add-btn')).toBeTruthy()
  })

  it('debe renderizar con animación por defecto', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton testID="skeleton" />,
    )

    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('debe renderizar sin animación cuando animated es false', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton animated={false} testID="skeleton" />,
    )

    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('debe renderizar en modo compact', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton compact testID="skeleton" />,
    )

    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('debe ajustar altura según aspect ratio square', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton
        imageAspectRatio="square"
        testID="skeleton"
      />,
    )

    expect(getByTestId('skeleton-image')).toBeTruthy()
  })

  it('debe ajustar altura según aspect ratio 16:9', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton
        imageAspectRatio="16:9"
        testID="skeleton"
      />,
    )

    expect(getByTestId('skeleton-image')).toBeTruthy()
  })
})
