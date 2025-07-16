import { Button } from '@mui/material'
import { CardAlert } from '../CardAlert'
import { useNavigate } from 'react-router-dom'

const RenewPlanCard = (): JSX.Element => {
  const navigate = useNavigate()

  const handleClick = (): void => {
    return navigate('/pricing')
  }

  return (
    <CardAlert
      title="Plan about to expire"
      text=" Enjoy 10% off when renewing your plan today."
      action={
        <Button onClick={(): void => handleClick()} variant="contained" size="small" fullWidth>
          Renew Plan
        </Button>
      }
    />
  )
}

export default RenewPlanCard
