import type { AxiosError } from 'axios'

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

interface ApiErrorResponse {
  message: string
  error?: string
  statusCode?: number
}

const ERROR_CODE_MAP: Record<number, ErrorCode> = {
  401: 'AUTHENTICATION_ERROR',
  500: 'SERVER_ERROR',
  0: 'NETWORK_ERROR',
}

const getErrorCode = (status?: number): ErrorCode => ERROR_CODE_MAP[status ?? 0] ?? 'UNKNOWN_ERROR'

const getErrorMessage = (error: AxiosError<ApiErrorResponse>): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.message) {
    return error.message
  }

  return 'An error occurred'
}

export const createApiError = (error: unknown): ApiErrorType => {
  if (error instanceof Error && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<ApiErrorResponse>
    return {
      message: getErrorMessage(axiosError),
      statusCode: axiosError.response?.status || 500,
      code: getErrorCode(axiosError.response?.status),
      originalError: error,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
      code: 'UNKNOWN_ERROR',
      originalError: error,
    }
  }

  return {
    message: 'An unknown error occurred',
    statusCode: 500,
    code: 'UNKNOWN_ERROR',
  }
}
