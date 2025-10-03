import { Alert, Button, Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const PaymentSuccess = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      gap={3}
      p={4}
    >
      <Alert severity="success" sx={{ mb: 2 }}>
        Payment successful! Thank you for your subscription.
      </Alert>
      <Typography variant="body1" textAlign="center">
        Your subscription has been activated. You can now access all premium features.
      </Typography>
      <Button variant="contained" color="primary" onClick={(): void => navigate('/dashboard')}>
        Go to Dashboard
      </Button>
    </Box>
  )
}

export default PaymentSuccess
