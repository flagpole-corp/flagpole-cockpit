import { useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import type { Theme } from '@mui/material'
import { Box, Stack, Button, CardContent, Card, Link, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormTextField } from '~/components/forms/FormTextField'
import { useAcceptInvitation } from '~/lib/api/onboarding'
import type { SystemStyleObject } from '@mui/system'
import { Logo, ColumnContent } from '~/components'
import { acceptInvitationSchema } from './types'
import type { AcceptInvitationFormData } from './types'

export const AcceptInvitation = (): JSX.Element => {
  const [searchParams] = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)
  const token = searchParams.get('token')

  const acceptInvitation = useAcceptInvitation()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  if (!token) {
    return <Navigate to="/signin" replace />
  }

  if (isSuccess) {
    return <Navigate to="/signin" replace />
  }

  const onSubmit = async (data: AcceptInvitationFormData): Promise<void> => {
    try {
      await acceptInvitation.mutateAsync({
        token,
        password: data.password,
      })
      reset()
      setIsSuccess(true)
    } catch (error) {
      console.error('Failed to accept invitation:', error)
    }
  }

  return (
    <Stack
      direction={{ xs: 'column-reverse', sm: 'row' }}
      sx={[
        {
          justifyContent: 'center',
          minHeight: '100%',
          alignItems: 'center',
          gap: { xs: 6, sm: 12 },
        },

        (theme): SystemStyleObject<Theme> => ({
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            zIndex: -1,
            inset: 0,
            backgroundImage: 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
            backgroundRepeat: 'no-repeat',
            ...theme.applyStyles('dark', {
              backgroundImage: 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
            }),
          },
        }),
      ]}
    >
      <ColumnContent />
      <Card sx={{ height: 'fit-content', my: 'auto' }}>
        <CardContent>
          <Link href="/">
            <Logo />
          </Link>
          <Typography variant="h5" gutterBottom>
            Accept Invitation
          </Typography>
          <Box
            component="form"
            onSubmit={(e): void => {
              e.preventDefault()
              handleSubmit(onSubmit)(e)
            }}
            noValidate
            autoComplete="off"
          >
            <Stack spacing={3}>
              <FormTextField
                control={control}
                name="password"
                label="Password"
                type="password"
                fullWidth
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />

              <FormTextField
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                autoComplete="new-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
              <Button fullWidth type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Setting up...' : 'Set Password'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  )
}
