import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import api from '~/lib/axios'
import { useAuthStore } from '~/stores/auth.store'

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

interface StripeProductsResponse {
  products: ProductWithFeatures[]
  environment: 'test' | 'live'
}

interface StripeEnvironmentResponse {
  environment: 'test' | 'live'
  isTestMode: boolean
}

interface CreateCheckoutSessionByPlanData {
  planType: 'basic' | 'professional' | 'enterprise'
  interval?: 'month' | 'year'
  customerId?: string
  trialPeriodDays?: number
  metadata?: Record<string, string>
}

interface CheckoutSession {
  id: string
  url: string
}

interface StripeError {
  message: string
}

export const stripeKeys = {
  all: ['stripe'] as const,
  checkout: () => [...stripeKeys.all, 'checkout'] as const,
  subscription: (id: string) => [...stripeKeys.all, 'subscription', id] as const,
  products: () => [...stripeKeys.all, 'products'] as const,
  environment: () => [...stripeKeys.all, 'environment'] as const,
}

export const useStripeProducts = (): UseQueryResult<StripeProductsResponse, Error> => {
  return useQuery({
    queryKey: stripeKeys.products(),
    queryFn: async () => {
      const { data } = await api.get<StripeProductsResponse>('/api/stripe/products')
      return data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useStripeEnvironment = (): UseQueryResult<StripeEnvironmentResponse, Error> => {
  return useQuery({
    queryKey: stripeKeys.environment(),
    queryFn: async () => {
      const { data } = await api.get<StripeEnvironmentResponse>('/api/stripe/environment')
      return data
    },
    staleTime: 60 * 60 * 1000,
  })
}

export const useCreateCheckoutSessionByPlan = (): UseMutationResult<
  CheckoutSession,
  StripeError,
  CreateCheckoutSessionByPlanData
> => {
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.post<CheckoutSession>('/api/stripe/create-checkout-session-by-plan', data, {
        headers: {
          'x-organization-id': user?.currentOrganization, // Use headers like other APIs!
        },
      })
      return response
    },
    onSuccess: (_, variables) => {
      console.warn(`Checkout session created for ${variables.planType} plan`)
    },
    onError: (error) => {
      console.error('Checkout session creation failed:', error)
      toast.error('Failed to initiate checkout. Please try again.')
    },
  })
}

export const useCancelSubscription = (): UseMutationResult<void, StripeError, string> => {
  return useMutation({
    mutationFn: async (subscriptionId) => {
      await api.post(`/api/stripe/subscription/${subscriptionId}/cancel`)
    },
    onSuccess: () => {
      toast.success('Subscription cancelled successfully')
    },
    onError: (error) => {
      console.error('Subscription cancellation failed:', error)
      toast.error('Failed to cancel subscription. Please try again.')
    },
  })
}

export const useUpdateSubscription = (): UseMutationResult<
  void,
  StripeError,
  { subscriptionId: string; priceId: string }
> => {
  return useMutation({
    mutationFn: async ({ subscriptionId, priceId }) => {
      await api.patch(`/api/stripe/subscription/${subscriptionId}`, {
        priceId,
      })
    },
    onSuccess: () => {
      toast.success('Subscription updated successfully')
    },
    onError: (error) => {
      console.error('Subscription update failed:', error)
      toast.error('Failed to update subscription. Please try again.')
    },
  })
}

interface UsePlanByTypeReturn extends Omit<UseQueryResult<StripeProductsResponse, Error>, 'data'> {
  plan: ProductWithFeatures | undefined
}

interface UsePlanPriceReturn extends Omit<UseQueryResult<StripeProductsResponse, Error>, 'data'> {
  price: ProductPrice | undefined
  plan: ProductWithFeatures | undefined
}

export const usePlanByType = (planType: 'basic' | 'professional' | 'enterprise'): UsePlanByTypeReturn => {
  const { data: productsData, ...rest } = useStripeProducts()

  const plan = productsData?.products.find((p) => p.metadata.plan_type === planType)

  return {
    plan,
    ...rest,
  }
}

export const usePlanPrice = (
  planType: 'basic' | 'professional' | 'enterprise',
  interval: 'month' | 'year' = 'month'
): UsePlanPriceReturn => {
  const { plan, ...rest } = usePlanByType(planType)

  const price = plan?.prices.find((p) => p.recurring?.interval === interval)

  return {
    price,
    plan,
    ...rest,
  }
}

export type {
  ProductWithFeatures,
  ProductFeatures,
  ProductPrice,
  StripeProductsResponse,
  StripeEnvironmentResponse,
  CreateCheckoutSessionByPlanData,
  CheckoutSession,
  UsePlanByTypeReturn,
  UsePlanPriceReturn,
}
