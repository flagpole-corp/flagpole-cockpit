import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAuthStore } from '~/stores/auth.store'
import api from '~/lib/axios'
import { toast } from 'react-toastify'

export interface LoginCredentials {
  email: string
  password: string
}

export type SubscriptionWarning = {
  showWarning: boolean
  daysRemaining?: number
  expiresAt?: string
  message?: string
}

export interface User {
  _id: string
  email: string
  firstName: string
  lastName?: string
  currentOrganization: string
  organizations: Array<{
    organization: string
    role: string
    joinedAt: string
  }>
  subscriptionWarning?: SubscriptionWarning
}

export interface AuthResponse {
  access_token: string
  user: User
}

interface ForgotPasswordResponse {
  message: string
}

interface ResetPasswordResponse {
  message: string
}

export interface AcceptInvitationResponse {
  success: boolean
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

export const useAcceptInvitation = (): UseMutationResult<
  AcceptInvitationResponse,
  Error,
  { token: string; password: string }
> => {
  return useMutation({
    mutationFn: async ({ token, password }) => {
      const { data } = await api.post<AcceptInvitationResponse>('/api/auth/accept-invitation', {
        token,
        password,
      })
      return data
    },
    onSuccess: () => {
      toast.success('Account setup complete! You can now sign in.')
    },
    onError: () => {
      toast.error('Failed to accept invitation. The link may be expired or invalid.')
    },
  })
}

export const useForgotPassword = (): UseMutationResult<ForgotPasswordResponse, Error, { email: string }> => {
  return useMutation({
    mutationFn: async ({ email }) => {
      const { data } = await api.post<ForgotPasswordResponse>('/api/auth/forgot-password', {
        email,
      })
      return data
    },
    onSuccess: () => {
      toast.success('If an account exists, a password reset email has been sent.')
    },
    onError: () => {
      toast.error('Failed to process password reset request. Please try again.')
    },
  })
}

export const useResetPassword = (): UseMutationResult<
  ResetPasswordResponse,
  Error,
  { token: string; password: string }
> => {
  return useMutation({
    mutationFn: async ({ token, password }) => {
      const { data } = await api.post<ResetPasswordResponse>('/api/auth/reset-password', {
        token,
        password,
      })
      return data
    },
    onSuccess: () => {
      toast.success('Password has been reset successfully. You can now sign in.')
    },
    onError: () => {
      toast.error('Failed to reset password. The link may be expired or invalid.')
    },
  })
}
