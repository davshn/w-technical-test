import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface TransactionState {
  customer: string;
  cardToken: string;
  acceptance_token: string;
  installments: number;
  brand: string;
  last_four: string;
}

const initialState: TransactionState = {
  customer: "",
  cardToken: "",
  acceptance_token: "",
  installments: 1,
  brand: "",
  last_four: "",
}

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    addCardToken: (state, action: PayloadAction<string>) => {
      state.cardToken = action.payload
    },
    addCustomer: (state, action: PayloadAction<string>) => {
      state.customer = action.payload
    },
    addAcceptanceToken: (state, action: PayloadAction<string>) => {
      state.acceptance_token = action.payload
    },
    addInstallments: (state, action: PayloadAction<number>) => {
      state.installments = action.payload
    },
    addBrand: (state, action: PayloadAction<string>) => {
      state.brand = action.payload
    },
    addLastFour: (state, action: PayloadAction<string>) => {
      state.last_four = action.payload
    },
    clearTransactions: (state) => {
      state = { ...initialState }
    },
  },
})

export const { addCardToken, addCustomer, addAcceptanceToken, addInstallments, clearTransactions, addBrand, addLastFour } = transactionSlice.actions
export default transactionSlice.reducer
