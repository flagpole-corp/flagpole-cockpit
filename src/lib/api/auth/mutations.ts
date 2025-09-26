import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import type { AuthResponse, ForgotPasswordResponse, LoginCredentials, ResetPasswordResponse } from './types'
import { useAuthStore } from '~/stores/auth.store'
import api from '~/lib/axios'
import { toast } from 'react-toastify'

export const useLogin = (): UseMutationResult<AuthResponse, Error, LoginCredentials> => {
  const { setUser, setToken, setRememberMe } = useAuthStore()

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const { data } = await api.post<AuthResponse>('/api/auth/login', credentials)
      return data
    },
    onSuccess: (data, variables) => {
      setToken(data.access_token)
      setUser(data.user)
      setRememberMe(variables.remember || false)
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
