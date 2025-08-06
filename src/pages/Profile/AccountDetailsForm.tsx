import { Card, CardContent, CardHeader, Divider, Grid2 as Grid, Typography, Box } from '@mui/material'
import { Form } from '~/components/Form'
import { FormTextField } from '~/components/FormTextField'
import type { User } from '~/lib/queries/auth'
import { profileSchema } from '~/lib/schemas/profile.schema'
import type { ProfileFormData } from '~/lib/schemas/profile.schema'

interface AccountDetailsFormProps {
  user: User | null
  onSubmit: (data: ProfileFormData) => Promise<void>
  formKey: string
}

export const AccountDetailsForm = ({ user, onSubmit, formKey }: AccountDetailsFormProps): JSX.Element => {
  return (
    <Card>
      <CardHeader subheader="The information can be edited" title="Profile" />
      <Divider sx={{ my: 2 }} />
      <CardContent>
        <Form<ProfileFormData>
          key={formKey}
          onSubmit={onSubmit}
          onCancel={(): void => {}}
          schema={profileSchema}
          defaultValues={{
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
          }}
        >
          {(control): JSX.Element => (
            <Grid container spacing={3}>
              <Grid
                size={{
                  md: 6,
                  xs: 12,
                }}
              >
                <FormTextField control={control} name="firstName" label="First name" fullWidth required />
              </Grid>
              <Grid
                size={{
                  md: 6,
                  xs: 12,
                }}
              >
                <FormTextField control={control} name="lastName" label="Last name" fullWidth />
              </Grid>

              {/* Email field - read-only display */}
              <Grid
                size={{
                  md: 6,
                  xs: 12,
                }}
              >
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Email
                  </Typography>
                  <Typography color="text.secondary">{user?.email}</Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </Form>
      </CardContent>
    </Card>
  )
}
