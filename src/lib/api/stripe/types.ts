import type { UseQueryResult } from '@tanstack/react-query'

interface ProductPrice {
  id: string
  unit_amount: number
  currency: string
  recurring?: {
    interval: 'month' | 'year'
    interval_count: number
  }
}

interface ProductFeatures {
  description: string[]
  buttonText: string
  subheader?: string
}

interface ProductWithFeatures {
  id: string
  name: string
  description?: string
  prices: ProductPrice[]
  features: ProductFeatures
  metadata: {
    plan_type: 'basic' | 'professional' | 'enterprise'
    max_projects?: string
    max_users?: string
    max_flags_per_project?: string
    available_conditions?: string
  }
}

export interface StripeProductsResponse {
  products: ProductWithFeatures[]
  environment: 'test' | 'live'
}

export interface StripeEnvironmentResponse {
  environment: 'test' | 'live'
  isTestMode: boolean
}

export interface CreateCheckoutSessionByPlanData {
  planType: 'basic' | 'professional' | 'enterprise'
  interval?: 'month' | 'year'
  customerId?: string
  trialPeriodDays?: number
  metadata?: Record<string, string>
}

export interface CheckoutSession {
  id: string
  url: string
}

export interface StripeError {
  message: string
}

export const stripeKeys = {
  all: ['stripe'] as const,
  checkout: () => [...stripeKeys.all, 'checkout'] as const,
  subscription: (id: string) => [...stripeKeys.all, 'subscription', id] as const,
  products: () => [...stripeKeys.all, 'products'] as const,
  environment: () => [...stripeKeys.all, 'environment'] as const,
}

export interface UsePlanByTypeReturn extends Omit<UseQueryResult<StripeProductsResponse, Error>, 'data'> {
  plan: ProductWithFeatures | undefined
}

export interface UsePlanPriceReturn extends Omit<UseQueryResult<StripeProductsResponse, Error>, 'data'> {
  price: ProductPrice | undefined
  plan: ProductWithFeatures | undefined
}
