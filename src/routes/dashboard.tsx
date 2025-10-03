import { lazy, Suspense } from 'react'
import type { NonIndexRouteConfig } from './config'

const Dashboard = lazy(() => import('~/pages/dashboard'))
const Flags = lazy(() => import('~/pages/flags'))
const Projects = lazy(() => import('~/pages/projects'))
const Users = lazy(() => import('~/pages/users'))
const PaymentSuccess = lazy(() => import('~/pages/payment-success'))
const PaymentCancel = lazy(() => import('~/pages/payment-cancel'))
const Pricing = lazy(() => import('~/pages/pricing'))
const Profile = lazy(() => import('~/pages/profile'))
const Feedback = lazy(() => import('~/pages/feedback'))
const Onboarding = lazy(() => import('~/pages/onboarding'))

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
  {
    path: '/onboarding',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Onboarding />
      </Suspense>
    ),
    title: 'Onboarding',
  },
]
