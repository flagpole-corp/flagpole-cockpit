import { useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { Box, Paper, Typography, Stack, Button } from '@mui/material'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormTextField } from '~/components/FormTextField'
import { useAcceptInvitation } from '~/lib/queries/auth'

const acceptInvitationSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>

const AcceptInvitation = (): JSX.Element => {
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
      p={2}
    >
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="h1" gutterBottom>
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

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Setting up...' : 'Set Password'}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </Box>
  )
}

export default AcceptInvitation
