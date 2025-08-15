import { Button } from '@mui/material'
import { CardAlert } from '../CardAlert'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '~/stores/auth.store'

const RenewPlanCard = (): JSX.Element => {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleClick = (): void => {
    return navigate('/pricing')
  }

  return (
    <CardAlert
      title={`Plan ${user?.subscriptionWarning?.daysRemaining! > 0 ? 'about to expire' : 'Expired'} `}
      text={user?.subscriptionWarning?.message ?? ''}
      action={
        <Button onClick={(): void => handleClick()} variant="contained" size="small" fullWidth>
          Renew Plan
        </Button>
      }
    />
  )
}

export default RenewPlanCard
