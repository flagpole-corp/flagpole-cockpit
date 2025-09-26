import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import type { CheckoutSession, CreateCheckoutSessionByPlanData, StripeError } from './types'
import { useAuthStore } from '~/stores/auth.store'
import api from '~/lib/axios'
import { toast } from 'react-toastify'

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
