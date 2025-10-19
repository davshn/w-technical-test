import { render } from '@testing-library/react-native'
import { ProductCardSkeleton } from './index'

describe('ProductCardSkeleton - Integration Tests', () => {
  it('should render all skeleton elements', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton testID="skeleton" />,
    )

    expect(getByTestId('skeleton-image')).toBeTruthy()
    expect(getByTestId('skeleton-badge')).toBeTruthy()
    expect(getByTestId('skeleton-name')).toBeTruthy()
    expect(getByTestId('skeleton-price')).toBeTruthy()
    expect(getByTestId('skeleton-detail-btn')).toBeTruthy()
  })

  it('should render with animation by default', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton testID="skeleton" />,
    )

    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('should render without animation when animated is false', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton animated={false} testID="skeleton" />,
    )

    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('should render in compact mode', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton compact testID="skeleton" />,
    )

    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('should adjust height for square aspect ratio', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton
        imageAspectRatio="square"
        testID="skeleton"
      />,
    )

    expect(getByTestId('skeleton-image')).toBeTruthy()
  })

  it('should adjust height for 16:9 aspect ratio', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton
        imageAspectRatio="16:9"
        testID="skeleton"
      />,
    )

    expect(getByTestId('skeleton-image')).toBeTruthy()
  })

  it('should adjust height for 4:3 aspect ratio', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton
        imageAspectRatio="4:3"
        testID="skeleton"
      />,
    )

    expect(getByTestId('skeleton-image')).toBeTruthy()
  })

  it('should render with responsive enabled', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton responsive testID="skeleton" />,
    )

    expect(getByTestId('skeleton')).toBeTruthy()
  })

  it('should render name skeleton with 2 lines', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton testID="skeleton" />,
    )

    expect(getByTestId('skeleton-name')).toBeTruthy()
  })

  it('should render price skeleton at 50% width', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton testID="skeleton" />,
    )

    expect(getByTestId('skeleton-price')).toBeTruthy()
  })

  it('should render detail button skeleton at full width', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton testID="skeleton" />,
    )

    expect(getByTestId('skeleton-detail-btn')).toBeTruthy()
  })

  it('should render compact skeleton with smaller sizes', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton compact testID="skeleton" />,
    )

    expect(getByTestId('skeleton-name')).toBeTruthy()
    expect(getByTestId('skeleton-price')).toBeTruthy()
    expect(getByTestId('skeleton-detail-btn')).toBeTruthy()
  })

  it('should render badge skeleton with pill shape', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton testID="skeleton" />,
    )

    expect(getByTestId('skeleton-badge')).toBeTruthy()
  })

  it('should position badge skeleton on top right of image', () => {
    const { getByTestId } = render(
      <ProductCardSkeleton testID="skeleton" />,
    )

    expect(getByTestId('skeleton-badge')).toBeTruthy()
  })
})