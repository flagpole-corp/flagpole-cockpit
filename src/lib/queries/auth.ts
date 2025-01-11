import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAuthStore } from '~/stores/auth.store'
import api from '~/lib/axios'

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  currentOrganization: string
  organizations: Array<{
    organization: string
    role: string
    joinedAt: string
  }>
}

export interface AuthResponse {
  access_token: string
  user: User
}

export const authKeys = {
  user: ['auth', 'user'] as const,
}

export const useUser = (): UseQueryResult<User, Error> => {
  const { token, user, setUser } = useAuthStore()

  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const { data } = await api.get<User>('/api/auth/me')
      setUser(data)
      return data
    },
    initialData: user,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 min
  })
}

export const useLogin = (): UseMutationResult<AuthResponse, Error, LoginCredentials> => {
  const { setUser, setToken } = useAuthStore()

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const { data } = await api.post<AuthResponse>('/api/auth/login', credentials)
      return data
    },
    onSuccess: (data) => {
      setToken(data.access_token)
      setUser(data.user)
    },
  })
}

export const useLogout = (): UseMutationResult<void, Error, void> => {
  const { setUser, setToken } = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      await api.post('/api/auth/logout')
    },
    onSettled: () => {
      setToken(null)
      setUser(null)
    },
  })
}

export const useGoogleLogin = (): UseMutationResult<void, Error, void> => {
  return useMutation<void, Error, void>({
    mutationFn: async (): Promise<void> => {
      window.location.href = '/api/auth/google'
    },
  })
}
