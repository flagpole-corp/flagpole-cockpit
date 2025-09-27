import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress, Typography, Alert, Card, CardContent, Button } from '@mui/material'
import { useAuthStore } from '~/stores/auth.store'

export const GoogleCallback = (): JSX.Element => {
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
        const code = searchParams.get('code')

        if (error) {
          const decodedError = decodeURIComponent(error)
          console.error('❌ Google authentication error:', decodedError)
          setStatus('error')
          setErrorMessage(decodedError)
          setError(new Error(decodedError))

          setTimeout(() => {
            navigate('/signin', {
              replace: true,
              state: {
                authError: decodedError,
                from: 'google-callback',
              },
            })
          }, 4000)
          return
        }

        if (token && success === 'true') {
          try {
            setStatus('loading')

            await handleGoogleCallback(token)

            setStatus('success')

            setTimeout(() => {
              navigate('/dashboard', {
                replace: true,
                state: { from: 'google-auth-success' },
              })
            }, 1500)
            //eslint-disable-next-line
          } catch (err: any) {
            console.error('💥 Error processing token:', err)
            const errorMsg = err instanceof Error ? err.message : 'Failed to process authentication token'
            setStatus('error')
            setErrorMessage(errorMsg)

            setTimeout(() => {
              navigate('/signin', {
                replace: true,
                state: {
                  authError: errorMsg,
                  from: 'token-processing-error',
                },
              })
            }, 4000)
          }
          return
        }

        // Check if we have a token but no success parameter
        if (token && !success) {
          console.warn('⚠️ Token present but success parameter missing, attempting to process anyway')
          try {
            setStatus('loading')

            await handleGoogleCallback(token)

            setStatus('success')

            setTimeout(() => {
              navigate('/dashboard', { replace: true })
            }, 1500)
            return
          } catch (err) {
            console.error('Failed to process token without success parameter:', err)
            // Continue to error handling below
          }
        }

        // Handle Google OAuth code (if present but not handled)
        if (code) {
          setStatus('error')
          setErrorMessage('Unexpected authentication flow detected')

          setTimeout(() => {
            navigate('/signin', {
              replace: true,
              state: { authError: 'Authentication flow error' },
            })
          }, 3000)
          return
        }

        // Invalid callback parameters - no error, no token, no code
        console.error('❌ Invalid auth callback parameters:', {
          token: token ? 'PRESENT' : 'MISSING',
          error: error ? 'PRESENT' : 'MISSING',
          success: success ? 'PRESENT' : 'MISSING',
          code: code ? 'PRESENT' : 'MISSING',
        })

        setStatus('error')
        setErrorMessage('Invalid authentication response. Please try again.')

        setTimeout(() => {
          navigate('/signin', {
            replace: true,
            state: { authError: 'Invalid authentication response' },
          })
        }, 3000)
      } catch (err) {
        console.error('💥 Unexpected error in auth callback:', err)
        const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred'
        setStatus('error')
        setErrorMessage(errorMsg)

        setTimeout(() => {
          navigate('/signin', {
            replace: true,
            state: { authError: errorMsg },
          })
        }, 4000)
      }
    }

    processCallback()
  }, [searchParams, navigate, handleGoogleCallback, setError])

  const handleRetry = (): void => {
    navigate('/signin', { replace: true })
  }

  const handleManualRedirect = (): void => {
    navigate('/dashboard', { replace: true })
  }

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
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Redirecting you to the dashboard...
              </Typography>
              <Button variant="outlined" onClick={handleManualRedirect} size="small">
                Go to Dashboard Now
              </Button>
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
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Redirecting you back to the sign-in page...
              </Typography>
              <Button variant="contained" onClick={handleRetry} size="small" sx={{ mr: 1 }}>
                Try Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
