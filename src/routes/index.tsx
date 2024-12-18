import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { SignIn } from '~/pages/SignIn'
import { createRoute } from '../factories/createRoute'
import { BasePageLayout } from '~/components'
import { DASHBOARD_ROUTES } from './dashboard'
import { AcceptInvitation } from '~/pages/AcceptInvitation'

export const APP_ROUTES = {
  HOME: createRoute({ path: '/' }),
  SIGNIN: createRoute({ path: '/signin', guestOnly: true }),
  SIGNUP: createRoute({ path: '/signup', guestOnly: true }),
  ACCEPT_INVITE: createRoute({ path: '/accept-invite', guestOnly: true }),
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
    path: APP_ROUTES.ACCEPT_INVITE.path,
    element: (
      <ProtectedRoute guestOnly>
        <AcceptInvitation />
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
