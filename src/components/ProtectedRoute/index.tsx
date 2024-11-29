import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '~/contexts/AuthContext'
import { APP_ROUTES } from '~/routes'

interface ProtectedRouteProps {
  children: ReactNode
  guestOnly?: boolean
}

export const ProtectedRoute = ({ children, guestOnly = false }: ProtectedRouteProps): JSX.Element => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()
  const token = localStorage.getItem('token')

  if (token && isLoading) {
    return <div>Loading...</div>
  }

  if (guestOnly && isAuthenticated) {
    return <Navigate to={APP_ROUTES.DASHBOARD.path} replace />
  }

  if (!guestOnly && !isAuthenticated) {
    // If the route is protected and user is not authenticated,
    // redirect to signin and save the attempted location
    return <Navigate to={APP_ROUTES.SIGNIN.path} state={{ from: location }} replace />
  }

  return <>{children}</>
}
