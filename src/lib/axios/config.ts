import type { AxiosInstance } from 'axios'
import axios from 'axios'
import { API_CONFIG } from './constants'

export const createApiInstance = (): AxiosInstance => {
  return axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: API_CONFIG.DEFAULT_HEADERS,
    withCredentials: API_CONFIG.WITH_CREDENTIALS,
  })
}
