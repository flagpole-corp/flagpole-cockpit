import { Box, CircularProgress, Grid2 as Grid, Stack, Typography } from '@mui/material'
import { useUpdateProfile } from '~/lib/api/user-profile'
import type { ProfileFormData } from '~/lib/schemas/profile.schema'
import { useAuthStore } from '~/stores/auth.store'
import { AccountInfo } from './AccountInfo'
import { AccountDetailsForm } from './AccountDetailsForm'

const Profile = (): JSX.Element => {
  const { user, isLoading, getCurrentOrgRole } = useAuthStore()
  const currentOrgRole = getCurrentOrgRole()

  const updateProfile = useUpdateProfile()

  const formKey = `${user?.firstName}-${user?.lastName}`

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  const handleSubmit = async (data: ProfileFormData): Promise<void> => {
    await updateProfile.mutateAsync(data)
  }

  return (
    <Stack spacing={3} width={'90%'}>
      <div>
        <Typography variant="h4">Account</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid
          size={{
            lg: 4,
            md: 6,
            xs: 12,
          }}
        >
          <AccountInfo user={user} currentOrgRole={currentOrgRole} />
        </Grid>
        <Grid
          size={{
            lg: 8,
            md: 6,
            xs: 12,
          }}
        >
          <AccountDetailsForm user={user} onSubmit={handleSubmit} formKey={formKey} />
        </Grid>
      </Grid>
    </Stack>
  )
}

export default Profile
