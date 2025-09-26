import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { StripeEnvironmentResponse, StripeProductsResponse } from './types'
import { stripeKeys } from './types'
import api from '~/lib/axios'

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
