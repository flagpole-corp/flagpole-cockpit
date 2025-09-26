import type { AxiosResponse } from 'axios'
import { useAuthStore } from '~/stores/auth.store'
import { AUTH_ENDPOINTS } from '../constants'

const isAuthRequest = (url: string = ''): boolean => {
  return Object.values(AUTH_ENDPOINTS).some((endpoint) => url.includes(endpoint))
}

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response
}

//eslint-disable-next-line
export const responseErrorInterceptor = (error: any): void | Promise<unknown> => {
  if (error.response?.status === 401) {
    const url = error.config?.url

    // Don't redirect for authentication-related requests
    if (!isAuthRequest(url)) {
      const { setToken, setUser } = useAuthStore.getState()
      setToken(null)
      setUser(null)
      window.location.href = '/signin'
    }
  }

  return Promise.reject(error)
}
