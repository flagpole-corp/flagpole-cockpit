import { ERROR_MESSAGES } from './messages'
import type { ApiErrorType } from './types'

export const isAuthError = (error: ApiErrorType): boolean => error.code === 'AUTHENTICATION_ERROR'
export const isNetworkError = (error: ApiErrorType): boolean => error.code === 'NETWORK_ERROR'
export const issubscriptionLimitError = (error: ApiErrorType): boolean => error.code === 'FEATURE_NOT_AVAILABLE'
export const getErrorMessage = (error: ApiErrorType): string =>
  ERROR_MESSAGES[error.code] ?? error.message ?? ERROR_MESSAGES.UNKNOWN_ERROR
