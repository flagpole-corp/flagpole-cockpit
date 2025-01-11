// src/stores/auth.store.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '~/lib/axios'
import type { AuthResponse, User } from '~/lib/queries/auth'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: Error | null
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setError: (error: Error | null) => void
  setLoading: (isLoading: boolean) => void
  getCurrentOrgRole: () => string | undefined
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
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

      getCurrentOrgRole: (): string | undefined => {
        const { user } = get()
        if (!user?.currentOrganization || !user?.organizations) return undefined

        const currentOrg = user.organizations.find((org) => org.organization === user.currentOrganization)
        return currentOrg?.role
      },

      login: async (email: string, password: string): Promise<void> => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post<AuthResponse>('/api/auth/login', {
            email,
            password,
          })

          set({ token: data.access_token })
          api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`

          const { data: fullProfile } = await api.get<User>('/api/auth/me')

          set({
            user: fullProfile,
            isLoading: false,
          })
        } catch (error) {
          set({ error: error as Error, isLoading: false })
          throw error
        }
      },

      loginWithGoogle: async (): Promise<void> => {
        window.location.href = '/api/auth/google'
      },

      logout: async (): Promise<void> => {
        set({ isLoading: true })
        try {
          await api.post('/api/auth/logout')
          set({ user: null, token: null, isLoading: false })
          delete api.defaults.headers.common['Authorization']
        } catch (error) {
          set({ error: error as Error, isLoading: false })
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
)
