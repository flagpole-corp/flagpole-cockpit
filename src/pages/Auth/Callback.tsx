import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Typography, Alert, Card, CardContent } from '@mui/material'
import { useAuthStore } from '~/stores/auth.store'

const AuthCallback = (): JSX.Element => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { handleGoogleCallback, setError } = useAuthStore()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const processCallback = async (): Promise<void> => {
      try {
        const token = searchParams.get('token')
        const error = searchParams.get('error')
        const success = searchParams.get('success')

        if (error) {
          // Handle error from backend
          console.error('Google authentication error:', error)
          setStatus('error')
          setErrorMessage(error)
          setError(new Error(error))

          // Redirect to signin after showing error
          setTimeout(() => {
            navigate('/signin', { replace: true })
          }, 4000)
          return
        }

        if (token && success === 'true') {
          // Handle successful authentication
          setStatus('success')

          // Process the token through our auth store
          await handleGoogleCallback(token)

          // Small delay to show success message, then redirect
          setTimeout(() => {
            navigate('/dashboard', { replace: true })
          }, 1500)
          return
        }

        // Invalid callback parameters
        console.error('Invalid auth callback - missing token or success parameter')
        setStatus('error')
        setErrorMessage('Invalid authentication response. Please try again.')

        setTimeout(() => {
          navigate('/signin', { replace: true })
        }, 3000)
      } catch (err) {
        console.error('Error processing auth callback:', err)
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred during authentication')

        setTimeout(() => {
          navigate('/signin', { replace: true })
        }, 4000)
      }
    }

    processCallback()
  }, [searchParams, navigate, handleGoogleCallback, setError])

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: 'background.default', p: 2 }}
    >
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          {status === 'loading' && (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                Processing Authentication
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please wait while we complete your sign-in...
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Typography variant="h4" sx={{ color: 'white' }}>
                  ✓
                </Typography>
              </Box>
              <Typography variant="h5" gutterBottom color="success.main">
                Authentication Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Redirecting you to the dashboard...
              </Typography>
            </>
          )}

          {status === 'error' && (
            <>
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="h6" gutterBottom>
                  Authentication Failed
                </Typography>
                <Typography variant="body2">{errorMessage}</Typography>
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Redirecting you back to the sign-in page...
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default AuthCallback
