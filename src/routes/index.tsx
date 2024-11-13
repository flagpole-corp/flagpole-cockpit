import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedRoute } from '../components/routing/ProtectedRoute'
import { SignIn } from '../pages/SignIn'
import { createRoute } from '../factories/createRoute'

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
])

export const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />
}
