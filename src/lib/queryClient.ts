import type { Query, QueryKey } from '@tanstack/react-query'
import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createApiError } from './errors/apiError'
import { isAuthError, isNetworkError, getErrorMessage } from './errors/utils'
import { useAuthStore } from '~/stores/auth.store'

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

const handleQueryError = (error: Error, query: Query<unknown, unknown, unknown, QueryKey>): void => {
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

const handleMutationError = (error: Error): void => {
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

  toast.error(errorMessage)
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error): boolean => {
        // Don't retry on auth errors
        const apiError = createApiError(error)
        if (isAuthError(apiError)) {
          return false
        }
        // Retry up to 2 times for other errors
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: (failureCount, error): boolean => {
        // Don't retry mutations on auth errors or client errors (4xx)
        const apiError = createApiError(error)
        if (isAuthError(apiError) || (apiError.statusCode >= 400 && apiError.statusCode < 500)) {
          return false
        }
        // Retry once for server errors (5xx)
        return failureCount < 1
      },
    },
  },
  queryCache: new QueryCache({
    onError: handleQueryError,
  }),
  mutationCache: new MutationCache({
    onError: handleMutationError,
  }),
})
