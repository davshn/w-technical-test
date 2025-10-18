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
      state.products.push(action.payload)
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
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

export const { addToCart, removeFromCart, clearCart, setCartNotification } = cartSlice.actions
export default cartSlice.reducer