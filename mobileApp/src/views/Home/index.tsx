import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'
import { ProductList } from '../../components/organism/ProductListOrg';
import type { Product } from '../../components/molecule/ProductCardMol/ProductCardProps';
import { fetchProducts } from '../../services/services';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../stateManagement/reducers/products.reducer';
import { addToCart, setCartNotification } from '../../stateManagement/reducers/cart.reducer';
import { ProductDetailModal } from '../../components/molecule/ProducDetailModalMol';

import type { RootState } from '../../stateManagement/store';

export default function HomeScreen() {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const products = useSelector((state: RootState) => {
    return state.products.products;
  })
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await fetchProducts()
      dispatch(setProducts(data))
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product)
  }
  const handleRefresh = async () => {
    await loadProducts()
  }

    const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product))
    dispatch(setCartNotification(true))
  }

  return (
    <>
      <ProductList
        products={products}
        loading={loading}
        onRefresh={handleRefresh}
        onProductPress={handleProductPress}
        onAddToCart={handleAddToCart}
        responsive
      />
      <ProductDetailModal
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});