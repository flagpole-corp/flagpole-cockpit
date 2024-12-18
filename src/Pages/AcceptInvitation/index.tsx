import { useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { Box, Paper, Typography, Button, CircularProgress, Stack } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { Form } from '~/components/Form'
import { FormTextField } from '~/components/FormTextField'
import api from '~/lib/axios'
import { toast } from 'react-toastify'

const acceptInvitationSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>

export const AcceptInvitation = (): JSX.Element => {
  const [searchParams] = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)
  const token = searchParams.get('token')

  const acceptInvitation = useMutation({
    mutationFn: async (data: { password: string }) => {
      const response = await api.post('/api/users/accept-invitation', {
        token,
        password: data.password,
      })
      return response.data
    },
    onSuccess: () => {
      toast.success('Account setup complete! You can now sign in.')
      setIsSuccess(true)
    },
    // eslint-disable-next-line
    onError: (error) => {
      toast.error('Failed to accept invitation. The link may be expired or invalid.')
    },
  })

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
          Accept Invitation
        </Typography>

        <Form<AcceptInvitationFormData>
          onSubmit={async (data): Promise<void> => {
            await acceptInvitation.mutateAsync({ password: data.password })
          }}
          onCancel={(): void => {}}
          schema={acceptInvitationSchema}
        >
          {(control): JSX.Element => (
            <Stack spacing={3}>
              <FormTextField
                control={control}
                name="password"
                label="Password"
                type="password"
                fullWidth
                autoComplete="new-password"
              />

              <FormTextField
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                autoComplete="new-password"
              />

              <Button type="submit" variant="contained" fullWidth disabled={acceptInvitation.isPending}>
                {acceptInvitation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Set Password & Accept'}
              </Button>
            </Stack>
          )}
        </Form>
      </Paper>
    </Box>
  )
}
