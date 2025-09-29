import { Grid2 as Grid } from '@mui/material'
import { DocsCard, OnboardingCard } from './components'

const Dashboard = (): JSX.Element => {
  return (
    <Grid spacing={2} container sx={{ width: '100%' }}>
      <Grid size={{ lg: 4, xs: 12 }}>
        <DocsCard />
      </Grid>
      <Grid size={{ lg: 4, xs: 12 }}>
        <OnboardingCard />
      </Grid>
    </Grid>
  )
}

export default Dashboard
