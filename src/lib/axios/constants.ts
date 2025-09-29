export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
  WITH_CREDENTIALS: true,
} as const

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  ACCEPT_INVITE: '/onboarding/accept-invitation',
} as const
