import React from 'react'
import { loadStripe } from '@stripe/stripe-js'
import type { ButtonOwnProps } from '@mui/material'
import { Button, CircularProgress } from '@mui/material'
import { useCreateCheckoutSession } from '~/lib/queries/stripe'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

interface CheckoutButtonProps extends ButtonOwnProps {
  priceId: string
  onSuccess: () => void
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  priceId,
  variant = 'contained',
  color = 'primary',
  children = 'Subscribe Now',
  onSuccess,
  fullWidth,
  disabled = false,
}) => {
  const createCheckoutSession = useCreateCheckoutSession()

  const handleClick = async (): Promise<void> => {
    try {
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      const { url } = await createCheckoutSession.mutateAsync({ priceId })

      // Redirect to Stripe Checkout
      window.location.href = url

      onSuccess?.()
    } catch (error) {
      console.error('Checkout error:', error)
    }
  }

  return (
    <Button
      variant={variant}
      color={color}
      fullWidth={fullWidth}
      onClick={handleClick}
      disabled={disabled || createCheckoutSession.isPending}
      startIcon={createCheckoutSession.isPending ? <CircularProgress size={20} color="inherit" /> : undefined}
    >
      {children}
    </Button>
  )
}

export default CheckoutButton
