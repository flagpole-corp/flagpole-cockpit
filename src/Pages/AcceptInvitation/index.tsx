import { useState } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { Box, Paper, Typography, Stack } from '@mui/material'
import { z } from 'zod'
import { Form } from '~/components/Form'
import { FormTextField } from '~/components/FormTextField'
import { useAcceptInvitation } from '~/lib/queries/accept-invitation'

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

const AcceptInvitation = (): JSX.Element => {
  const [searchParams] = useSearchParams()
  const [isSuccess, setIsSuccess] = useState(false)
  const token = searchParams.get('token')

  const acceptInvitation = useAcceptInvitation()

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
            await acceptInvitation.mutateAsync({
              token,
              password: data.password,
            })

            setIsSuccess(true)
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
            </Stack>
          )}
        </Form>
      </Paper>
    </Box>
  )
}

export default AcceptInvitation
