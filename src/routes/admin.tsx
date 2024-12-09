import type { NonIndexRouteConfig } from './config'
import { OnboardingPage } from '~/pages/admin/Onboarding'
import { OrganizationsPage } from '~/pages/admin/Organizations'

// List of authorized admin emails
export const ADMIN_EMAILS = ['user@test.com'] as string[]
export type AdminEmail = (typeof ADMIN_EMAILS)[number]

// Admin routes
export const ADMIN_ROUTES: NonIndexRouteConfig[] = [
  {
    path: '/admin/onboarding',
    element: <OnboardingPage />,
    title: 'Customer Onboarding',
  },
  {
    path: '/admin/organizations',
    element: <OrganizationsPage />,
    title: 'Organizations',
  },
]
