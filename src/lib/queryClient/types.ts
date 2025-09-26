export type ErrorCode =
  | 'AUTHENTICATION_ERROR'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'
  | 'FEATURE_NOT_AVAILABLE'

export interface ApiErrorType {
  message: string
  statusCode: number
  code: ErrorCode
  originalError?: Error
}

export interface ApiErrorResponse {
  message: string
  error?: string
  statusCode?: number
}
