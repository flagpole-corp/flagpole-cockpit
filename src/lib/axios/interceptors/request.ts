import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '~/stores/auth.store'

export const requestInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = useAuthStore.getState().token
  const user = useAuthStore.getState().user

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (user?.currentOrganization) {
    config.headers['x-organization-id'] = user.currentOrganization
  }

  return config
}

//eslint-disable-next-line
export const requestErrorInterceptor = (error: any) => {
  return Promise.reject(error)
}
