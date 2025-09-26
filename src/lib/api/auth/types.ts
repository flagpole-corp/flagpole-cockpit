export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export type SubscriptionWarning = {
  showWarning: boolean
  daysRemaining?: number
  expiresAt?: string
  message?: string
}

export interface User {
  _id: string
  email: string
  firstName: string
  lastName?: string
  currentOrganization: string
  organizations: Array<{
    organization: string
    role: string
    joinedAt: string
  }>
  subscriptionWarning?: SubscriptionWarning
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordResponse {
  message: string
}
