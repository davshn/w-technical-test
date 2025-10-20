import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { ProductList } from '../../components/organism/ProductListOrg';
import type { Product } from '../../components/molecule/ProductCardMol/ProductCardProps';
import { fetchProducts } from '../../services/services';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '../../stateManagement/reducers/products.reducer';
import { addToCart, setCartNotification } from '../../stateManagement/reducers/cart.reducer';
import { ProductDetailModal } from '../../components/molecule/ProducDetailModalMol';
import type { RootState } from '../../stateManagement/store';
import { ToastBase } from '../../components/atom';

export default function HomeScreen() {
  const dispatch = useDispatch()
  const products = useSelector((state: RootState) => {
    return state.products.products;
  })

  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

    useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await fetchProducts()
      dispatch(setProducts(data))
    } catch (error) {
      setToastMessage('Error cargando productos, intentalo de nuevo')
      setToastType('error')
      setToastVisible(true)
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
    setToastMessage('Producto añadido al carrito, revisa el carrito para finalizar tu compra')
    setToastType('success')
    setToastVisible(true)
    dispatch(setCartNotification(true))
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
        responsive
      />
      <ProductDetailModal
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
      <ToastBase message={toastMessage} duration={2000} variant={toastType} visible={toastVisible} position={'top'} onHide={() => setToastVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});