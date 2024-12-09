import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { SignIn } from '~/pages/SignIn'
import { createRoute } from '../factories/createRoute'
import { AdminRoute, BasePageLayout } from '~/components'
import { DASHBOARD_ROUTES } from './dashboard'
import { ADMIN_ROUTES } from './admin'

export const APP_ROUTES = {
  HOME: createRoute({ path: '/' }),
  SIGNIN: createRoute({ path: '/signin', guestOnly: true }),
  SIGNUP: createRoute({ path: '/signup', guestOnly: true }),
  DASHBOARD: createRoute({ path: '/dashboard', protected: true }),
  FLAGS: createRoute({ path: '/flags', protected: true }),
  ADMIN: {
    ONBOARDING: createRoute({ path: '/admin/onboarding', protected: true, adminOnly: true }),
    ORGANIZATIONS: createRoute({ path: '/admin/organizations', protected: true, adminOnly: true }),
  },
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
    element: (
      <ProtectedRoute>
        <BasePageLayout />
      </ProtectedRoute>
    ),
    children: [
      ...DASHBOARD_ROUTES,
      ...ADMIN_ROUTES.map((route) => ({
        ...route,
        element: <AdminRoute>{route.element}</AdminRoute>,
      })),
    ] as RouteObject[],
  },
] satisfies RouteObject[])

export const AppRouter = (): JSX.Element => {
  return <RouterProvider router={router} />
}
