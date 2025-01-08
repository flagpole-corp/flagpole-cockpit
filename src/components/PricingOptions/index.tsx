import type { SyntheticEvent } from 'react'
import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CheckoutButton from '../CheckoutButton'
import { useStripeProducts } from '~/lib/queries/stripe'

interface BaseTierFeatures {
  description: string[]
  buttonText: string
  buttonVariant: 'outlined' | 'contained'
  buttonColor: 'primary' | 'secondary'
}

interface StandardTierFeatures extends BaseTierFeatures {
  subheader?: never
}

interface ProfessionalTierFeatures extends BaseTierFeatures {
  subheader: string
}

// type TierFeatures = StandardTierFeatures | ProfessionalTierFeatures

interface Tier {
  title: string
  price: string
  priceId: string
  interval: 'month' | 'year'
  description: string[]
  buttonText: string
  buttonVariant: 'outlined' | 'contained'
  buttonColor: 'primary' | 'secondary'
  subheader?: string
  numericPrice: number
}

const tierFeatures: Record<string, StandardTierFeatures | ProfessionalTierFeatures> = {
  // Basic
  prod_RXu4TEXPAgwqqy: {
    description: [
      '1 team member',
      '1 project',
      '10 flags per project',
      'Percentage rollout',
      'Basic support',
      'Help center access',
    ],
    buttonText: 'Get Basic',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
  // Professional
  prod_RXu6jl6q5Ry1PQ: {
    subheader: 'Recommended',
    description: [
      '50 team members',
      '50 projects',
      '500 flags per project',
      'User targeting',
      'Percentage rollout',
      'Location-based targeting',
      'Priority email support',
      'Help center access',
    ],
    buttonText: 'Get Professional',
    buttonVariant: 'contained',
    buttonColor: 'secondary',
  },
  // Enterprise
  prod_RXu9WCW9kuxjSC: {
    description: [
      '200 team members',
      '200 projects',
      '1000 flags per project',
      'All targeting conditions included',
      'Advanced targeting options',
      'Premium support & SLA',
      'Help center access',
    ],
    buttonText: 'Get Enterprise',
    buttonVariant: 'outlined',
    buttonColor: 'primary',
  },
} as const

export const PricingOptions = (): JSX.Element => {
  const [billingInterval, setBillingInterval] = useState<'year' | 'month'>('year')
  const { data: products, isLoading, error } = useStripeProducts()

  const handleTabChange = (_: SyntheticEvent, newValue: 'year' | 'month'): void => {
    setBillingInterval(newValue)
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">Failed to load pricing information. Please try again later.</Alert>
      </Container>
    )
  }

  const tiers =
    products
      ?.flatMap((product) => {
        const prices = product.prices.filter((price) => price.recurring?.interval === billingInterval)

        return prices
          .map((price) => {
            const tierFeature = tierFeatures[product.id]

            if (!tierFeature) {
              console.warn(`No tier features found for product ${product.id} (${product.name})`)
              return null
            }

            return {
              title: product.name,
              price: (price.unit_amount / 100).toString(),
              priceId: price.id,
              interval: billingInterval,
              numericPrice: price.unit_amount / 100,
              ...tierFeature,
            } satisfies Tier
          })
          .filter((tier): tier is Tier => tier !== null)
      })
      .sort((a, b) => a.numericPrice - b.numericPrice) || []

  return (
    <Container
      id="pricing"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
          Pricing
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Quickly build an effective pricing table for your potential customers with this layout.
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Tabs value={billingInterval} onChange={handleTabChange} aria-label="billing interval">
          <Tab label="Annual Billing" value="year" />
          <Tab label="Monthly Billing" value="month" />
        </Tabs>
      </Box>

      <Grid container spacing={3} sx={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        {isLoading
          ? [...Array(3)].map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card sx={{ p: 2, height: '100%' }}>
                  <Skeleton variant="rectangular" height={400} />
                </Card>
              </Grid>
            ))
          : tiers?.map((tier) => (
              <Grid
                size={{ xs: 12, sm: tier.title === 'Enterprise' ? 12 : 6, md: 4 }}
                key={`${tier.title}-${tier.interval}`}
              >
                <Card
                  sx={[
                    {
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      height: '100%',
                    },
                    tier.title === 'Professional' &&
                      ((theme): object => ({
                        border: 'none',
                        background: 'radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))',
                        boxShadow: '0 8px 12px hsla(220, 20%, 42%, 0.2)',
                        ...theme.applyStyles('dark', {
                          background: 'radial-gradient(circle at 50% 0%, hsl(220, 20%, 20%), hsl(220, 30%, 16%))',
                          boxShadow: '0 8px 12px hsla(0, 0%, 0%, 0.8)',
                        }),
                      })),
                  ]}
                >
                  <CardContent>
                    <Box
                      sx={[
                        {
                          mb: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 2,
                        },
                        tier.title === 'Professional' ? { color: 'grey.100' } : { color: '' },
                      ]}
                    >
                      <Typography component="h3" variant="h6">
                        {tier.title}
                      </Typography>
                      {tier.title === 'Professional' && <Chip icon={<AutoAwesomeIcon />} label={tier.subheader} />}
                    </Box>
                    <Box
                      sx={[
                        {
                          display: 'flex',
                          alignItems: 'baseline',
                        },
                        tier.title === 'Professional' ? { color: 'grey.50' } : { color: null },
                      ]}
                    >
                      <Typography component="h3" variant="h2">
                        ${tier.price}
                      </Typography>
                      <Typography component="h3" variant="h6">
                        &nbsp; per {tier.interval}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2, opacity: 0.8, borderColor: 'divider' }} />
                    {tier?.description?.map((line) => (
                      <Box key={line} sx={{ py: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <CheckCircleRoundedIcon
                          sx={[
                            {
                              width: 20,
                            },
                            tier.title === 'Professional' ? { color: 'primary.light' } : { color: 'primary.main' },
                          ]}
                        />
                        <Typography
                          variant="subtitle2"
                          component={'span'}
                          sx={[tier.title === 'Professional' ? { color: 'grey.50' } : { color: null }]}
                        >
                          {line}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                  <CardActions>
                    <CheckoutButton
                      fullWidth
                      onSuccess={(): void => {
                        // eslint-disable-next-line
                        console.log('Checkout initiated')
                      }}
                      priceId={tier.priceId}
                      variant={tier.buttonVariant}
                      color={tier.buttonColor}
                    >
                      {tier.buttonText}
                    </CheckoutButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
      </Grid>
    </Container>
  )
}

export default PricingOptions
