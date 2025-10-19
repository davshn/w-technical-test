import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './reducers/products.reducer'
import cartReducer from './reducers/cart.reducer'
import transactionReducer from './reducers/transaction.reducer'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    transaction: transactionReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch