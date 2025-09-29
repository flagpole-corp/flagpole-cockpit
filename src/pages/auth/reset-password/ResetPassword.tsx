import { useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { Box, Paper, Typography, Stack } from '@mui/material'
import { z } from 'zod'
import { Form } from '~/components/forms'
import { FormTextField } from '~/components/forms/FormTextField'
import { useResetPassword } from '~/lib/api/auth'

const resetPasswordSchema = z
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export const ResetPassword = (): JSX.Element => {
  const [searchParams] = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)
  const token = searchParams.get('token')

  const resetPassword = useResetPassword()

  if (!token) {
    return <Navigate to="/signin" replace />
  }

  if (isSuccess) {
    return <Navigate to="/signin" replace />
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
          Reset Password
        </Typography>

        <Form<ResetPasswordFormData>
          onSubmit={async (data): Promise<void> => {
            await resetPassword.mutateAsync({
              token,
              password: data.password,
            })
            setIsSuccess(true)
          }}
          onCancel={(): void => {}}
          schema={resetPasswordSchema}
        >
          {(control): JSX.Element => (
            <Stack spacing={3}>
              <FormTextField
                control={control}
                name="password"
                label="New Password"
                type="password"
                fullWidth
                autoComplete="new-password"
              />

              <FormTextField
                control={control}
                name="confirmPassword"
                label="Confirm New Password"
                type="password"
                fullWidth
                autoComplete="new-password"
              />
            </Stack>
          )}
        </Form>
      </Paper>
    </Box>
  )
}
