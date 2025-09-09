import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  Button,
  Card as MuiCard,
  Checkbox,
  Divider,
  FormLabel,
  FormControl,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { GoogleIcon } from './CustomIcons'
import { ForgotPasswordInput, Logo } from '~/components'
import { loginSchema, type LoginFormData } from '~/lib/schemas/auth.schema'
import { useAuthStore } from '~/stores/auth.store'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow: 'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))

const SignInCard = (): JSX.Element => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loginWithGoogle, error: authError, isLoading, setError } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    if (location.state?.authError) {
      setError(new Error(location.state.authError))
      window.history.replaceState({}, document.title)
    }
  }, [location.state, setError])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      await login({
        email: data.email,
        password: data.password,
        remember: data.remember,
      })
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      setGoogleLoading(true)
      await loginWithGoogle()
    } catch (err) {
      console.error('Google login failed:', err)
      setGoogleLoading(false)
    }
  }

  const handleClickOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const isButtonLoading = isLoading || googleLoading

  return (
    <Card variant="outlined">
      <Link href="/">
        <Logo />
      </Link>
      <Typography variant="h5">Sign in</Typography>

      {authError && (
        <Typography color="error" sx={{ textAlign: 'center' }}>
          {authError instanceof Error ? authError.message : 'An error occurred'}
        </Typography>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }): JSX.Element => (
            <FormControl error={!!errors.email}>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                {...field}
                id="email"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={isButtonLoading}
              />
            </FormControl>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }): JSX.Element => (
            <FormControl error={!!errors.password}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  sx={{ alignSelf: 'baseline' }}
                  disabled={isButtonLoading}
                >
                  Forgot your password?
                </Link>
              </Box>
              <TextField
                {...field}
                id="password"
                type="password"
                placeholder="••••••"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={isButtonLoading}
              />
            </FormControl>
          )}
        />

        <Controller
          name="remember"
          control={control}
          render={({ field: { onChange, value, ...field } }): JSX.Element => (
            <FormControlLabel
              control={<Checkbox checked={value} onChange={onChange} disabled={isButtonLoading} {...field} />}
              label="Remember me"
            />
          )}
        />

        <ForgotPasswordInput open={open} handleClose={handleClose} />

        <Button type="submit" fullWidth variant="contained" disabled={isButtonLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>

        <Typography sx={{ textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <Link href="/request-demo" variant="body2" sx={{ alignSelf: 'center' }}>
            Request a demo
          </Link>
        </Typography>
      </Box>

      <Divider>or</Divider>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleLogin}
          startIcon={<GoogleIcon />}
          disabled={isButtonLoading}
        >
          {googleLoading ? 'Redirecting...' : 'Sign in with Google'}
        </Button>
      </Box>
    </Card>
  )
}

export default SignInCard
