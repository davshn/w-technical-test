import { useState, useMemo } from 'react'
import { FlatList, StyleSheet, ListRenderItem } from 'react-native'

import { View, Text} from '../../atom'
import { SearchBar } from '../../molecule/SearchBarMol'
import { ProductCard } from '../../molecule/ProductCardMol'
import { ProductCardSkeleton } from '../../molecule/ProductCardSkeletonMol'
import type { Product } from '../../molecule/ProductCardMol/ProductCardProps'
import type { ProductListProps } from './ProductListProps'

const ItemSeparator = () => <View style={styles.separator} />

export const ProductList: React.FC<ProductListProps> = ({
  products = [],
  loading = false,
  onSearch,
  onRefresh,
  onProductPress,
  skeletonCount = 6,
  emptyMessage = 'No se encontraron productos',
  searchPlaceholder = 'Buscar productos electrónicos...',
  responsive = true,
  testID = 'product-list-screen',
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products

    const query = searchQuery.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
    )
  }, [products, searchQuery])

  const handleSearch = async (query: string) => {
    setIsSearching(true)
    try {
      if (onSearch) {
        await onSearch(query)
      }
    } finally {
      setIsSearching(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      if (onRefresh) {
        await onRefresh()
      }
    } finally {
      setRefreshing(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text
        size="3xl"
        weight="bold"
        color="primary"
        align="center"
        style={styles.title}
        responsive={responsive}
      >
        Productos Electrónicos
      </Text>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        placeholder={searchPlaceholder}
        loading={isSearching}
        size="base"
        variant="outlined"
        debounceTime={onSearch ? 500 : 0}
        responsive={responsive}
        testID={`${testID}-search`}
      />
    </View>
  )

  const renderSkeletons = () => (
    <View style={styles.skeletonsContainer}>
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <ProductCardSkeleton
          key={`skeleton-${index}`}
          responsive={responsive}
          testID={`${testID}-skeleton-${index}`}
        />
      ))}
    </View>
  )

  const renderEmptyState = () => {
    if (loading) return null

    return (
      <View
        style={styles.emptyContainer}
        justifyContent="center"
        alignItems="center"
      >
        <Text
          size="xl"
          weight="semibold"
          color="secondary"
          align="center"
          responsive={responsive}
        >
          {emptyMessage}
        </Text>
        {searchQuery.trim() && (
          <Text
            size="base"
            color="muted"
            align="center"
            style={styles.emptySubtext}
            responsive={responsive}
          >
            Intenta con otros términos de búsqueda
          </Text>
        )}
      </View>
    )
  }

  const renderProduct: ListRenderItem<Product> = ({ item, index }) => (
    <View style={styles.productCardContainer}>
      <ProductCard
        product={item}
        onPress={onProductPress}
        responsive={responsive}
        testID={`${testID}-product-${index}`}
      />
    </View>
  )
  return (
    <View
      flex={1}
      style={styles.container}
      testID={testID}
      variant={'outlined'}
    >
      {renderHeader()}

      {loading && !refreshing ? (
        renderSkeletons()
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={ItemSeparator}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh ? handleRefresh : undefined}
          testID={`${testID}-list`}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={6}
          windowSize={10}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerContainer: {
    marginBottom: 16,
    gap: 16,
  },
  title: {
    marginBottom: 8,
  },
  skeletonsContainer: {
    gap: 16,
    paddingBottom: 24,
  },
  listContent: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  productCardContainer: {
    alignItems: 'center',
  },
  separator: {
    height: 16,
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptySubtext: {
    marginTop: 8,
  },
})