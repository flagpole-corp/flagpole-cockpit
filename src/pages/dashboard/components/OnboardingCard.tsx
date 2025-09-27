import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CardAlert } from '~/components'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'

export const OnboardingCard = (): JSX.Element => {
  const navigate = useNavigate()
  return (
    <CardAlert
      title="Onboarding"
      icon={<RocketLaunchIcon />}
      text="Still not so sure how to get started? Head to our onboarding"
      action={
        <Button onClick={(): void => navigate('/onboarding')} variant="contained" size="small" fullWidth>
          Go to onboarding
        </Button>
      }
    />
  )
}
