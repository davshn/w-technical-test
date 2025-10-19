import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Product } from '../../components/molecule/ProductCardMol/ProductCardProps';

interface CartState {
  products: Product[];
  cartNotification: boolean;
}

const initialState: CartState = {
  products: [],
  cartNotification: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      if ( state.products.find(product => product.id === action.payload.id) ) {
        return
      }
      state.products.push(action.payload)
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload
      const product = state.products.find(prod => prod.id === id)
      if (product) {
        product.quantity = quantity
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter(product => product.id !== +action.payload)
    },
    clearCart: (state) => {
      state.products = []
    },
    setCartNotification: (state, action: PayloadAction<boolean>) => {
      state.cartNotification = action.payload
    },
  },
})

export const { addToCart, removeFromCart, clearCart, setCartNotification, updateCartItemQuantity } = cartSlice.actions
export default cartSlice.reducer