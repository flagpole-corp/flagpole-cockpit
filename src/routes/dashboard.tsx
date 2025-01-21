import { Suspense } from 'react'
import type { NonIndexRouteConfig } from './config'
import { Feedback, Dashboard, Flags, Projects, Users, PaymentCancel, PaymentSuccess, Pricing, Profile } from '~/pages'

export const DASHBOARD_ROUTES: NonIndexRouteConfig[] = [
  {
    path: '/dashboard',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Dashboard />
      </Suspense>
    ),
    title: 'Overview',
  },
  {
    path: '/flags',
    element: (
      <Suspense fallback={<>Loading...</>}>
        {' '}
        <Flags />
      </Suspense>
    ),
    title: 'Feature Flags',
  },
  {
    path: '/projects',
    element: (
      <Suspense fallback={<>Loading...</>}>
        {' '}
        <Projects />
      </Suspense>
    ),
    title: 'Projects',
  },
  {
    path: '/users',
    element: (
      <Suspense fallback={<>Loading...</>}>
        {' '}
        <Users />
      </Suspense>
    ),
    title: 'Users',
  },
  {
    path: '/pricing',
    element: (
      <Suspense fallback={<>Loading...</>}>
        {' '}
        <Pricing />
      </Suspense>
    ),
    title: 'Pricing',
  },
  {
    path: '/feedback',
    element: (
      <Suspense fallback={<>Loading...</>}>
        {' '}
        <Feedback />
      </Suspense>
    ),
    title: 'Feedback',
  },
  {
    path: '/payment/success',
    element: (
      <Suspense fallback={<>Loading...</>}>
        {' '}
        <PaymentSuccess />
      </Suspense>
    ),
    title: 'Payment Success',
  },
  {
    path: '/payment/cancel',
    element: (
      <Suspense fallback={<>Loading...</>}>
        {' '}
        <PaymentCancel />
      </Suspense>
    ),
    title: 'Payment Cancel',
  },
  {
    path: '/profile',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Profile />
      </Suspense>
    ),
    title: 'Profile',
  },
]
