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

export interface AuthResponse {
  access_token: string
  user: User
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  currentOrganization?: string
}

export const authKeys = {
  user: ['auth', 'user'] as const,
}

export const useUser = (): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: async (): Promise<User> => {
      const { data } = await api.get<User>('/api/auth/me')
      return data
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export const useLogin = (): UseMutationResult<AuthResponse, Error, LoginCredentials> => {
  const queryClient = useQueryClient()

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials): Promise<AuthResponse> => {
      const { data } = await api.post<AuthResponse>('/api/auth/login', credentials)
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem('token', data.access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
      queryClient.setQueryData(authKeys.user, data.user)
    },
  })
}

export const useLogout = (): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, void>({
    mutationFn: async (): Promise<void> => {
      await api.post('/api/auth/logout')
    },
    onSuccess: () => {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
      queryClient.setQueryData(authKeys.user, null)
      queryClient.invalidateQueries()
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
