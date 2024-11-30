import type { NonIndexRouteConfig } from './config'
import { Dashboard } from '~/pages/Dashboard'
import { Flags } from '~/pages/Flags'

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
]
