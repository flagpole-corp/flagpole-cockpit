import { createApiInstance } from './config'
import { setupInterceptors } from './interceptors'

const api = createApiInstance()
setupInterceptors(api)

export default api
