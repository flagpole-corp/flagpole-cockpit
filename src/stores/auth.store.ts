import type { LoginDto } from '@flagpole/api-types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '~/lib/axios'
import type { AuthResponse, User } from '~/lib/api/auth'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: Error | null
  remember: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setError: (error: Error | null) => void
  setLoading: (isLoading: boolean) => void
  setRememberMe: (rememberMe: boolean) => void
  getCurrentOrgRole: () => string | undefined
  login: ({ email, password, remember }: LoginDto & { remember?: boolean }) => Promise<void>
  loginWithGoogle: () => Promise<void>
  handleGoogleCallback: (token: string) => Promise<void>
  logout: () => Promise<void>
}

const cleanId = (id: string): string => id.replace(/^new ObjectId\("([^"]+)"\)$/, '$1').replace(/[{}\s\n_:]/g, '')

const cleanUser = (user: User | null): User | null => {
  if (!user) return null

  const cleaned = {
    ...user,
    id: cleanId(user._id),
    currentOrganization: cleanId(user.currentOrganization),
    organizations: user.organizations.map((org) => ({
      ...org,
      organization: cleanId(org.organization),
      joinedAt: new Date(org.joinedAt).toISOString(),
    })),
  }

  return cleaned
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      remember: false,
      setUser: (user): void => set({ user: user ? cleanUser(user) : null }),
      setToken: (token): void => {
        set({ token })
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
          delete api.defaults.headers.common['Authorization']
        }
      },
      setError: (error): void => set({ error }),
      setLoading: (isLoading): void => set({ isLoading }),
      setRememberMe: (remember): void => set({ remember }),
      getCurrentOrgRole: (): string | undefined => {
        const { user } = get()
        if (!user?.currentOrganization || !user?.organizations) return undefined

        const currentOrg = user.organizations.find((org) => org.organization === user.currentOrganization)
        return currentOrg?.role
      },

      login: async ({ email, password, remember = false }: LoginDto & { remember?: boolean }): Promise<void> => {
        set({ isLoading: true, error: null, remember })
        try {
          const { data } = await api.post<AuthResponse>('/api/auth/login', {
            email,
            password,
            remember,
          })

          set({ token: data.access_token })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`

          const { data: fullProfile } = await api.get<User>('/api/auth/me')

          set({
            user: fullProfile,
            isLoading: false,
            error: null, // Clear any previous errors on successful login
          })
        } catch (error) {
          // Extract meaningful error message
          let errorMessage = 'An error occurred during login'

          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as any // eslint-disable-line
            if (axiosError.response?.data?.message) {
              errorMessage = axiosError.response.data.message
            } else if (axiosError.response?.status === 401) {
              errorMessage = 'Invalid email or password'
            } else if (axiosError.response?.status >= 500) {
              errorMessage = 'Server error. Please try again later.'
            } else if (axiosError.message) {
              errorMessage = axiosError.message
            }
          }

          set({
            error: new Error(errorMessage),
            isLoading: false,
            token: null,
            user: null,
            remember: false,
          })
          throw error
        }
      },

      loginWithGoogle: async (): Promise<void> => {
        try {
          set({ isLoading: true, error: null })

          // Get the API URL from your axios config or environment
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'

          // Redirect to Google OAuth endpoint
          window.location.href = `${apiUrl}/api/auth/google`
        } catch (error) {
          console.error('Error initiating Google login:', error)
          set({
            error: new Error('Failed to initiate Google login'),
            isLoading: false,
          })
          throw error
        }
      },

      handleGoogleCallback: async (token: string): Promise<void> => {
        try {
          set({ isLoading: true, error: null })

          // Set the token
          set({ token })
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // Fetch user profile
          const { data: fullProfile } = await api.get<User>('/api/auth/me')

          set({
            user: fullProfile,
            isLoading: false,
            error: null,
          })
        } catch (error) {
          console.error('Error handling Google callback:', error)
          let errorMessage = 'Failed to complete Google authentication'

          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as any // eslint-disable-line
            if (axiosError.response?.data?.message) {
              errorMessage = axiosError.response.data.message
            }
          }

          set({
            error: new Error(errorMessage),
            isLoading: false,
            token: null,
            user: null,
          })
          throw error
        }
      },

      logout: async (): Promise<void> => {
        set({ isLoading: true })
        try {
          await api.post('/api/auth/logout')
          set({ user: null, token: null, isLoading: false, error: null })
          delete api.defaults.headers.common['Authorization']
        } catch (error) {
          // Even if logout fails, clear local state
          set({
            user: null,
            token: null,
            isLoading: false,
            error: error as Error,
            remember: false,
          })
          delete api.defaults.headers.common['Authorization']
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        rememberMe: state.remember,
      }),
    }
  )
)
