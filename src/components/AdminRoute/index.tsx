import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '~/contexts/AuthContext'
import { ADMIN_EMAILS } from '~/routes/admin'

interface AdminRouteProps {
  children: ReactNode
}

export const AdminRoute = ({ children }: AdminRouteProps): JSX.Element => {
  const { user } = useAuth()

  if (!user?.email || !ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
