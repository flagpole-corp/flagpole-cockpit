import { Feedback } from '~/pages/Feedback'
import type { NonIndexRouteConfig } from './config'
import { Dashboard } from '~/pages/Dashboard'
import { Flags } from '~/pages/Flags'
import { Projects } from '~/pages/Projects'
import { Users } from '~/pages/Users'
import PaymentSuccess from '~/pages/PaymentSuccess'
import PaymentCancel from '~/pages/PaymentCancel'
import { Pricing } from '~/pages/Pricing'
import Profile from '~/pages/Profile'

export const DASHBOARD_ROUTES: NonIndexRouteConfig[] = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    title: 'Overview',
  },
  {
    path: '/flags',
    element: <Flags />,
    title: 'Feature Flags',
  },
  {
    path: '/projects',
    element: <Projects />,
    title: 'Projects',
  },
  {
    path: '/users',
    element: <Users />,
    title: 'Users',
  },
  {
    path: '/pricing',
    element: <Pricing />,
    title: 'Pricing',
  },
  {
    path: '/feedback',
    element: <Feedback />,
    title: 'Feedback',
  },
  {
    path: '/payment/success',
    element: <PaymentSuccess />,
    title: 'Payment Success',
  },
  {
    path: '/payment/cancel',
    element: <PaymentCancel />,
    title: 'Payment Cancel',
  },
  {
    path: '/profile',
    element: <Profile />,
    title: 'Profile',
  },
]
