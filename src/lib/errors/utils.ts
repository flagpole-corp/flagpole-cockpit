import type { ApiErrorType } from './apiError'
import { ERROR_MESSAGES } from './messages'

export const isAuthError = (error: ApiErrorType): boolean => error.code === 'AUTHENTICATION_ERROR'

export const isNetworkError = (error: ApiErrorType): boolean => error.code === 'NETWORK_ERROR'

export const getErrorMessage = (error: ApiErrorType): string =>
  ERROR_MESSAGES[error.code] ?? error.message ?? ERROR_MESSAGES.UNKNOWN_ERROR
