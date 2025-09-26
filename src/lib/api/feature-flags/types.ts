import type { CreateFeatureFlagDto } from '@flagpole/api-types'

export interface FeatureFlag {
  _id: string
  name: string
  description: string
  isEnabled: boolean
  project: string
  conditions: Record<string, unknown>
  environments: string[]
  createdAt: string
  updatedAt: string
}

export interface UseFeatureFlagsOptions {
  enabled?: boolean
}

export interface ToggleFlagVariables {
  flagId: string
  projectId: string
}

export interface ToggleFlagContext {
  previousFlags: FeatureFlag[] | undefined
}

export interface UpdateFeatureFlagVariables {
  id: string
  data: Partial<CreateFeatureFlagDto>
}

export interface DeleteFeatureFlagVariables {
  id: string
  projectId: string
}

export const flagKeys = {
  all: ['flags'] as const,
  lists: () => [...flagKeys.all, 'list'] as const,
  list: (projectId: string) => [...flagKeys.lists(), projectId] as const,
}
