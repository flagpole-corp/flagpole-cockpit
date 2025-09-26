import type { UsePlanPriceReturn } from '~/lib/api/stripe/types'
import { usePlanByType } from './useByPlanType'

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
