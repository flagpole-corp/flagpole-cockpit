import { lazy, Suspense } from 'react'
import type { NonIndexRouteConfig } from './config'

const ActivityLogs = lazy(() => import('~/pages/activity-logs'))
const Dashboard = lazy(() => import('~/pages/Dashboard'))
const Flags = lazy(() => import('~/pages/Flags'))
const Projects = lazy(() => import('~/pages/Projects'))
const Users = lazy(() => import('~/pages/users'))
const PaymentSuccess = lazy(() => import('~/pages/PaymentSuccess'))
const PaymentCancel = lazy(() => import('~/pages/PaymentCancel'))
const Pricing = lazy(() => import('~/pages/Pricing'))
const Profile = lazy(() => import('~/pages/Profile'))
const Feedback = lazy(() => import('~/pages/Feedback'))
const Onboarding = lazy(() => import('~/pages/Onboarding'))

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
        <Flags />
      </Suspense>
    ),
    title: 'Feature Flags',
  },
  {
    path: '/projects',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Projects />
      </Suspense>
    ),
    title: 'Projects',
  },
  {
    path: '/users',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Users />
      </Suspense>
    ),
    title: 'Users',
  },
  {
    path: '/pricing',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Pricing />
      </Suspense>
    ),
    title: 'Pricing',
  },
  {
    path: '/feedback',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <Feedback />
      </Suspense>
    ),
    title: 'Feedback',
  },
  {
    path: '/activity-logs',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <ActivityLogs />
      </Suspense>
    ),
    title: 'Activity Logs',
  },
  {
    path: '/payment/success',
    element: (
      <Suspense fallback={<>Loading...</>}>
        <PaymentSuccess />
      </Suspense>
    ),
    title: 'Payment Success',
  },
  {
    path: '/payment/cancel',
    element: (
      <Suspense fallback={<>Loading...</>}>
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
