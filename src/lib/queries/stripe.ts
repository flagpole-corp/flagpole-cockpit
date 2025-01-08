import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import api from '~/lib/axios'

interface StripePrice {
  id: string
  unit_amount: number
  currency: string
  recurring?: {
    interval: 'day' | 'week' | 'month' | 'year'
    interval_count: number
  }
}

interface StripeProduct {
  id: string
  name: string
  description: string | null
  active: boolean
  default_price: string
  prices: StripePrice[]
  metadata: Record<string, string>
}

interface CreateCheckoutSessionData {
  priceId: string
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
}

export const useCreateCheckoutSession = (): UseMutationResult<
  CheckoutSession,
  StripeError,
  CreateCheckoutSessionData
> => {
  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.post<CheckoutSession>('/api/stripe/create-checkout-session', data)
      return response
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
      await api.post(`/api/stripe/subscriptions/${subscriptionId}/cancel`)
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
      await api.patch(`/api/stripe/subscriptions/${subscriptionId}`, {
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

export const useStripeProducts = (): UseQueryResult<StripeProduct[], Error> => {
  return useQuery({
    queryKey: [...stripeKeys.all, 'products'],
    queryFn: async () => {
      const { data } = await api.get<StripeProduct[]>('/api/stripe/products')
      return data
    },
  })
}
