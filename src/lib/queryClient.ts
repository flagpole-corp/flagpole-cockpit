import type { Query, QueryKey } from '@tanstack/react-query'
import { QueryClient, QueryCache } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createApiError } from './errors/apiError'
import { isAuthError, isNetworkError, getErrorMessage } from './errors/utils'
import { authKeys } from './queries/auth'

const ERROR_HANDLERS: Record<string, (message: string) => void> = {
  [authKeys.user[0]]: (message) => toast.error(message),
}

const handleDefaultError = (message: string): string | number => toast.error(message)

const queryCacheOnError = (error: Error, query: Query<unknown, unknown, unknown, QueryKey>): void => {
  const apiError = createApiError(error)
  const errorMessage = getErrorMessage(apiError)

  if (isAuthError(apiError)) {
    localStorage.removeItem('token')
    toast.error(errorMessage)
    window.location.href = '/signin'
    return
  }

  if (isNetworkError(apiError)) {
    toast.error(errorMessage)
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
