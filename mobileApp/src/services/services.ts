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
