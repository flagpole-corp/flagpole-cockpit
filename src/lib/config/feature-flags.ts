import type { ConditionType } from '../types/feature-flags'

export const FEATURE_FLAG_CONDITIONS: Record<
  ConditionType,
  {
    label: string
    description: string
    availablePlans: string[]
  }
> = {
  user: {
    label: 'User Targeting',
    description: 'Target specific users or user groups',
    availablePlans: ['pro', 'enterprise'],
  },
  percentage: {
    label: 'Percentage Rollout',
    description: 'Gradually roll out to a percentage of users',
    availablePlans: ['pro', 'enterprise'],
  },
  time: {
    label: 'Time-based',
    description: 'Enable features based on schedule',
    availablePlans: ['enterprise'],
  },
  geo: {
    label: 'Location-based',
    description: 'Target users by location',
    availablePlans: ['enterprise'],
  },
  device: {
    label: 'Device/Platform',
    description: 'Target specific devices or platforms',
    availablePlans: ['enterprise'],
  },
  custom: {
    label: 'Custom Attributes',
    description: 'Create your own targeting rules',
    availablePlans: ['enterprise'],
  },
}
