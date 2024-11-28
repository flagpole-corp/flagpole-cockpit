import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { SignIn } from '../pages/SignIn'
import { createRoute } from '../factories/createRoute'
import { Dashboard } from '~/pages/Dashboard'

export const APP_ROUTES = {
  HOME: createRoute({ path: '/' }),
  SIGNIN: createRoute({ path: '/signin', guestOnly: true }),
  SIGNUP: createRoute({ path: '/signup', guestOnly: true }),
  DASHBOARD: createRoute({ path: '/dashboard', protected: true }),
} as const

export const router = createBrowserRouter([
  {
    path: APP_ROUTES.SIGNIN.path,
    element: (
      <ProtectedRoute guestOnly>
        <SignIn />
      </ProtectedRoute>
    ),
  },
  {
    path: APP_ROUTES.DASHBOARD.path,
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
])

export const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />
}
