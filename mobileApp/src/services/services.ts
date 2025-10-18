import axios from "axios"

const ENVIRONMENT_URL = 'http://18.116.39.97:3000'

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${ENVIRONMENT_URL}/products`)
    return response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const getAceptanceToken = async () => {
  try {
    const response = await axios.get(`${ENVIRONMENT_URL}/transactions/aceptance`)
    return response.data.token
  } catch (error) {
    console.error('Error fetching aceptance token:', error)
    throw error
  }
}

export const tokenizeCard = async (cardDetails: {
  number: string
  card_holder: string
  exp_month: string
  exp_year: string
  cvc: string
}) => {
  try {
    const response = await axios.post(`${ENVIRONMENT_URL}/transactions/tokenize`, cardDetails)
    return response.data.token
  } catch (error) {
    console.error('Error tokenizing card:', error)
    throw error
  }
}

export const createTransaction = async (transactionData: {
  amount: number
  cardToken: string
  customer: string
  acceptation_token: string
  acceptance_token: string
  installments: number
  products: Array<{ productId: number; quantity: number }>
}) => {
  try {
    const response = await axios.post(`${ENVIRONMENT_URL}/transactions`, transactionData)
    return response.data
  } catch (error) {
    console.error('Error creating transaction:', error)
    throw error
  }
}

export const getTransactionStatus = async (transactionId: string) => {
  try {
    const response = await axios.put(`${ENVIRONMENT_URL}/transactions/${transactionId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching transaction status:', error)
    throw error
  }
}