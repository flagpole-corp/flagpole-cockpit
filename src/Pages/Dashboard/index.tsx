import { Button, Grid2 as Grid } from '@mui/material'
import { CardAlert } from '~/components'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
const Dashboard = (): JSX.Element => {
  return (
    <Grid spacing={2} container sx={{ width: '100%' }}>
      <Grid size={{ lg: 4, xs: 12 }}>
        <CardAlert
          title="Docs"
          icon={<LibraryBooksIcon />}
          text="Read our docs to learn how to easily integrate with your code"
          action={
            <Button variant="contained" size="small" fullWidth>
              Go to docs
            </Button>
          }
        />
      </Grid>
      <Grid size={{ lg: 4, xs: 12 }}>
        <CardAlert
          title="Onboarding"
          icon={<RocketLaunchIcon />}
          text="Still not so sure how to get started? Head to our onboarding"
          action={
            <Button variant="contained" size="small" fullWidth>
              Go to onboarding
            </Button>
          }
        />
      </Grid>
    </Grid>
  )
}

export default Dashboard
