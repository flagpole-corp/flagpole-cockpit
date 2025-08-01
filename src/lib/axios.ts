import axios from 'axios'
import { useAuthStore } from '~/stores/auth.store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  const user = useAuthStore.getState().user

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (user?.currentOrganization) {
    config.headers['x-organization-id'] = user.currentOrganization
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this is a login request - don't redirect during login attempts
      const isLoginRequest = error.config?.url?.includes('/auth/login')
      const isForgotPasswordRequest = error.config?.url?.includes('/auth/forgot-password')
      const isResetPasswordRequest = error.config?.url?.includes('/auth/reset-password')
      const isAcceptInviteRequest = error.config?.url?.includes('/auth/accept-invitation')

      // Don't redirect for authentication-related requests
      if (!isLoginRequest && !isForgotPasswordRequest && !isResetPasswordRequest && !isAcceptInviteRequest) {
        const { setToken, setUser } = useAuthStore.getState()
        setToken(null)
        setUser(null)
        window.location.href = '/signin'
      }
    }
    return Promise.reject(error)
  }
)

export default api
