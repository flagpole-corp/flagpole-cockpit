import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '~/stores/auth.store'
import { APP_ROUTES } from '~/routes'
import { Box, CircularProgress } from '@mui/material'

interface ProtectedRouteProps {
  children: ReactNode
  guestOnly?: boolean
}

export const ProtectedRoute = ({ children, guestOnly = false }: ProtectedRouteProps): JSX.Element => {
  const { user, token, isLoading } = useAuthStore()
  const location = useLocation()

  if (token && isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  const isAuthenticated = !!user
  const isAuthCallback = location.pathname === APP_ROUTES.GOOGLE_CALLBACK.path

  if (guestOnly && isAuthenticated && !isAuthCallback) {
    return <Navigate to={'/dashboard'} replace />
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to={APP_ROUTES.SIGNIN.path} state={{ from: location }} replace />
  }

  return <>{children}</>
}
