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
  const { user, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  const isAuthenticated = !!user
  const isAuthCallback = location.pathname === APP_ROUTES.GOOGLE_CALLBACK.path

  // Special handling for auth callback - allow it to proceed regardless of auth state
  if (isAuthCallback) {
    return <>{children}</>
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to={'/dashboard'} replace />
  }

  if (!guestOnly && !isAuthenticated) {
    return <Navigate to={APP_ROUTES.SIGNIN.path} state={{ from: location }} replace />
  }

  return <>{children}</>
}
