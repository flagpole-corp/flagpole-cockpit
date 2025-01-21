import type { NonIndexRouteConfig } from './config'
import { Feedback, Dashboard, Flags, Projects, Users, PaymentCancel, PaymentSuccess, Pricing, Profile } from '../pages'

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
