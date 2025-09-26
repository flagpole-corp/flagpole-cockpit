import React, { useState } from 'react'
import type { ButtonProps } from '@mui/material'
import { Button, CircularProgress } from '@mui/material'
import { useCreateCheckoutSessionByPlan } from '~/lib/queries/stripe'
import { useAuthStore } from '~/stores/auth.store'

interface CheckoutButtonProps extends Omit<ButtonProps, 'onClick' | 'onError'> {
  priceId?: string
  planType?: 'basic' | 'professional' | 'enterprise'
  interval?: 'month' | 'year'
  customerId?: string
  trialPeriodDays?: number
  metadata?: Record<string, string>
  onSuccess?: () => void
  onError?: (error: Error) => void
  children: React.ReactNode
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  priceId,
  planType,
  interval = 'month',
  customerId,
  trialPeriodDays,
  metadata,
  onSuccess,
  onError,
  children,
  disabled,
  ...buttonProps
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const createCheckoutSession = useCreateCheckoutSessionByPlan()

  const { user } = useAuthStore()

  const handleClick = async (): Promise<void> => {
    if (!planType) {
      onError?.(new Error('Plan type is required'))
      return
    }

    if (!user?.currentOrganization) {
      onError?.(new Error('No organization selected'))
      return
    }

    setIsProcessing(true)

    try {
      const session = await createCheckoutSession.mutateAsync({
        planType,
        interval,
        customerId,
        trialPeriodDays,
        metadata: {
          ...metadata,
          userId: user?._id,
        },
      })

      if (session.url) {
        window.location.href = session.url
        onSuccess?.()
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      setIsProcessing(false)
      onError?.(error as Error)
    }
  }

  const isLoading = isProcessing || createCheckoutSession.isPending

  return (
    <Button
      {...buttonProps}
      onClick={handleClick}
      disabled={disabled || isLoading}
      startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
    >
      {isLoading ? 'Processing...' : children}
    </Button>
  )
}

export default CheckoutButton
