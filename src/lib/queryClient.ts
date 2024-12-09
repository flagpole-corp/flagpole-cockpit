import type { Query, QueryKey } from '@tanstack/react-query'
import { QueryClient, QueryCache } from '@tanstack/react-query'
import { createApiError } from './errors/apiError'
import { isAuthError, isNetworkError, getErrorMessage } from './errors/utils'
import { authKeys } from './queries/auth'

let showSnackbarRef: ((message: string, severity: 'error' | 'success' | 'info' | 'warning') => void) | null = null

export const setSnackbarRef = (ref: typeof showSnackbarRef): void => {
  showSnackbarRef = ref
}

const ERROR_HANDLERS: Record<string, (message: string) => void> = {
  [authKeys.user[0]]: (message) => showSnackbarRef?.(message, 'error'),
}

const handleDefaultError = (message: string): void => {
  showSnackbarRef?.(message, 'error')
}

const queryCacheOnError = (error: Error, query: Query<unknown, unknown, unknown, QueryKey>): void => {
  const apiError = createApiError(error)
  const errorMessage = getErrorMessage(apiError)

  if (isAuthError(apiError)) {
    localStorage.removeItem('token')
    showSnackbarRef?.(errorMessage, 'error')
    window.location.href = '/signin'
    return
  }

  if (isNetworkError(apiError)) {
    showSnackbarRef?.(errorMessage, 'error')
    return
  }

  // Since QueryKey is readonly, we need to safely access the first element
  const queryKey = Array.isArray(query.queryKey) && query.queryKey[0]
  const handleError = (queryKey && ERROR_HANDLERS[queryKey]) || handleDefaultError
  handleError(errorMessage)
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: queryCacheOnError,
  }),
})
