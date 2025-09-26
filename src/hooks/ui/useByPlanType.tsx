import { useStripeProducts } from '~/lib/api/stripe/queries'
import type { UsePlanByTypeReturn } from '~/lib/api/stripe/types'

export const usePlanByType = (planType: 'basic' | 'professional' | 'enterprise'): UsePlanByTypeReturn => {
  const { data: productsData, ...rest } = useStripeProducts()

  const plan = productsData?.products.find((p) => p.metadata.plan_type === planType)

  return {
    plan,
    ...rest,
  }
}
