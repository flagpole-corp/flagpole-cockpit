import type { Query, QueryKey } from '@tanstack/react-query'
import { createApiError } from './errors'
import { getErrorMessage, isAuthError, isNetworkError } from './utils'
import { useAuthStore } from '~/stores/auth.store'
import { toast } from 'react-toastify'

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    // eslint-disable-next-line
    const axiosError = error as any
    if (axiosError.response?.data) {
      const { message, error: errorType } = axiosError.response.data

      if (Array.isArray(message)) {
        return message.join(', ')
      }

      if (typeof message === 'string') {
        return message
      }

      if (typeof errorType === 'string') {
        return errorType
      }
    }

    if (axiosError.message) {
      return axiosError.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  const apiError = createApiError(error)
  return getErrorMessage(apiError)
}

export const handleQueryError = (error: Error, query: Query<unknown, unknown, unknown, QueryKey>): void => {
  const apiError = createApiError(error)
  const errorMessage = extractErrorMessage(error)

  if (isAuthError(apiError)) {
    const { setToken, setUser } = useAuthStore.getState()
    setToken(null)
    setUser(null)
    toast.error(errorMessage)
    window.location.href = '/signin'
    return
  }

  if (isNetworkError(apiError)) {
    toast.error(errorMessage)
    return
  }

  const queryKey = Array.isArray(query.queryKey) ? query.queryKey[0] : null

  const skipToastQueries: unknown[] = [
    // Add query keys here that shouldn't show error toasts
  ]

  if (queryKey && skipToastQueries.includes(queryKey as string)) {
    return
  }

  toast.error(errorMessage)
}

// eslint-disable-next-line
export const handleMutationError = (error: Error, mutation: any): void => {
  const apiError = createApiError(error)
  const errorMessage = extractErrorMessage(error)

  if (mutation.options?.meta?.skipGlobalError) {
    return
  }

  if (isAuthError(apiError)) {
    const { setToken, setUser } = useAuthStore.getState()
    setToken(null)
    setUser(null)
    toast.error(errorMessage)
    window.location.href = '/signin'
    return
  }

  if (isNetworkError(apiError)) {
    toast.error(errorMessage)
    return
  }
  toast.error(errorMessage)
}
