import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { createApiError } from './errors'
import { isAuthError } from './utils'
import { handleMutationError, handleQueryError } from './config'

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
