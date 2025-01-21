import { Box, Card, CardContent, Typography, Stack, Chip, CircularProgress } from '@mui/material'
import { useAuthStore } from '~/stores/auth.store'
import { Form } from '~/components/Form'
import { FormTextField } from '~/components/FormTextField'
import { profileSchema } from '~/lib/schemas/profile.schema'
import type { ProfileFormData } from '~/lib/schemas/profile.schema'
import { useUpdateProfile } from '~/lib/queries/user-profile'

export const Profile = (): JSX.Element => {
  const { user, isLoading, getCurrentOrgRole } = useAuthStore()
  const updateProfile = useUpdateProfile()

  const formKey = `${user?.firstName}-${user?.lastName}`

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  const currentOrgRole = getCurrentOrgRole()

  const handleSubmit = async (data: ProfileFormData): Promise<void> => {
    await updateProfile.mutateAsync(data)
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Profile Settings
          </Typography>

          <Form<ProfileFormData>
            key={formKey}
            onSubmit={handleSubmit}
            onCancel={(): void => {}}
            schema={profileSchema}
            defaultValues={{
              firstName: user?.firstName || '',
              lastName: user?.lastName || '',
            }}
          >
            {(control): JSX.Element => (
              <Stack spacing={3}>
                <FormTextField control={control} name="firstName" label="First Name" fullWidth />
                <FormTextField control={control} name="lastName" label="Last Name" fullWidth />

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Email
                  </Typography>
                  <Typography>{user?.email}</Typography>
                </Box>

                {currentOrgRole && (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Organization Role
                    </Typography>
                    <Chip label={currentOrgRole.toUpperCase()} color="primary" variant="outlined" />
                  </Box>
                )}
              </Stack>
            )}
          </Form>
        </CardContent>
      </Card>
    </Box>
  )
}
