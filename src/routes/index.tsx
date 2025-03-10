import { createBrowserRouter, Navigate, RouterProvider, type RouteObject } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import SignIn from '~/pages/SignIn'
import AcceptInvitation from '~/pages/AcceptInvitation'
import { createRoute } from '../factories/createRoute'
import { BasePageLayout } from '~/components'
import { DASHBOARD_ROUTES } from './dashboard'
import RequestDemo from '~/pages/RequestDemo'
import ResetPassword from '~/pages/ResetPassword'

export const APP_ROUTES = {
  HOME: createRoute({ path: '/' }),
  SIGNIN: createRoute({ path: '/signin', guestOnly: true }),
  SIGNUP: createRoute({ path: '/signup', guestOnly: true }),
  ACCEPT_INVITE: createRoute({ path: '/accept-invite', guestOnly: true }),
  DEMO_REQUEST: createRoute({ path: '/request-demo', guestOnly: true }),
  RESET_PASSWORD: createRoute({ path: '/reset-password', guestOnly: true }),
} as const

export const router = createBrowserRouter([
  {
    path: APP_ROUTES.HOME.path,
    element: (
      <ProtectedRoute guestOnly>
        <Navigate to={'/dashboard'} replace />
      </ProtectedRoute>
    ),
  },
  {
    path: APP_ROUTES.SIGNIN.path,
    element: (
      <ProtectedRoute guestOnly>
        <SignIn />
      </ProtectedRoute>
    ),
  },
  {
    path: APP_ROUTES.ACCEPT_INVITE.path,
    element: (
      <ProtectedRoute guestOnly>
        <AcceptInvitation />
      </ProtectedRoute>
    ),
  },
  {
    path: APP_ROUTES.DEMO_REQUEST.path,
    element: (
      <ProtectedRoute guestOnly>
        <RequestDemo />
      </ProtectedRoute>
    ),
  },
  {
    path: APP_ROUTES.RESET_PASSWORD.path,
    element: (
      <ProtectedRoute guestOnly>
        <ResetPassword />
      </ProtectedRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <BasePageLayout />
      </ProtectedRoute>
    ),
    children: [...DASHBOARD_ROUTES] as RouteObject[],
  },
] satisfies RouteObject[])

export const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />
}
