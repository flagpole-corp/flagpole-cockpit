// src/components/routing/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
// import { useAuth } from '../../context/auth/AuthContext'
import { APP_ROUTES } from '~/routes'

interface ProtectedRouteProps {
  children: ReactNode
  guestOnly?: boolean
}

let isAuthenticated = false

export const ProtectedRoute = ({ children, guestOnly }: ProtectedRouteProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true) // this is temp while we dont have the api ready to use
  // const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(!isLoading)
    }, 1500)
  }, [])

  if (isLoading) {
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
