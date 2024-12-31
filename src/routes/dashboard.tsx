import { Feedback } from '~/pages/Feedback'
import type { NonIndexRouteConfig } from './config'
import { Dashboard } from '~/pages/Dashboard'
import { Flags } from '~/pages/Flags'
import { Projects } from '~/pages/Projects'
import { Users } from '~/pages/Users'

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
    path: '/feedback',
    element: <Feedback />,
    title: 'Feedback',
  },
]
