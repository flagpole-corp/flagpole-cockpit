import type { ErrorCode } from './apiError'

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  AUTHENTICATION_ERROR: 'Your session has expired. Please sign in again.',
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
}
