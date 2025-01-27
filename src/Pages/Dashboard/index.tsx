import { Button, Grid2 as Grid } from '@mui/material'
import { CardAlert } from '~/components'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import { useNavigate } from 'react-router-dom'
const Dashboard = (): JSX.Element => {
  const navitate = useNavigate()

  return (
    <Grid spacing={2} container sx={{ width: '100%' }}>
      <Grid size={{ lg: 4, xs: 12 }}>
        <CardAlert
          title="Docs"
          icon={<LibraryBooksIcon />}
          text="Read our docs to learn how to easily integrate with your code"
          action={
            <Button
              variant="contained"
              onClick={(): Window | null =>
                window.open('https://docs.useflagpole.dev', '_blank', 'noopener,noreferrer')
              }
              size="small"
              fullWidth
            >
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
            <Button onClick={(): void => navitate('/onboarding')} variant="contained" size="small" fullWidth>
              Go to onboarding
            </Button>
          }
        />
      </Grid>
    </Grid>
  )
}

export default Dashboard
