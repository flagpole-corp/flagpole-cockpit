import type { AxiosInstance } from 'axios'
import { requestInterceptor, requestErrorInterceptor } from './request'
import { responseInterceptor, responseErrorInterceptor } from './response'

export const setupInterceptors = (apiInstance: AxiosInstance): AxiosInstance => {
  apiInstance.interceptors.request.use(requestInterceptor, requestErrorInterceptor)

  apiInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)

  return apiInstance
}
