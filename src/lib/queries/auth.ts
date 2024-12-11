import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query'
import api from '~/lib/axios'

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
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
  const token = localStorage.getItem('token')

  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const { data } = await api.get<User>('/api/auth/me')
      // Store updated user data
      localStorage.setItem('user', JSON.stringify(data))
      return data
    },
    // Initialize with stored data
    initialData: token ? JSON.parse(localStorage.getItem('user') || 'null') : null,
    // retry: false,
    // staleTime: 5 * 60 * 1000,
    // gcTime: 10 * 60 * 1000,
    enabled: !!token,
  })
}

export const useLogin = (): UseMutationResult<AuthResponse, Error, LoginCredentials> => {
  const queryClient = useQueryClient()

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const { data } = await api.post<AuthResponse>('/api/auth/login', credentials)
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
      queryClient.setQueryData(authKeys.user, data.user)
    },
  })
}

export const useLogout = (): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api.post('/api/auth/logout')
    },
    onSuccess: () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete api.defaults.headers.common['Authorization']
      queryClient.setQueryData(authKeys.user, null)
      queryClient.clear()
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
