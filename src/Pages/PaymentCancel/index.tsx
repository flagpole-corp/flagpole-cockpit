import React from 'react'
import { Alert, Button, Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const PaymentCancel: React.FC = () => {
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
      <Alert severity="info" sx={{ mb: 2 }}>
        Payment cancelled. No charges were made.
      </Alert>
      <Typography variant="body1" textAlign="center">
        If you have any questions or concerns, please don't hesitate to contact our support team.
      </Typography>
      <Button variant="contained" color="primary" onClick={(): void => navigate(-1)}>
        Return to Checkout
      </Button>
    </Box>
  )
}

export default PaymentCancel
