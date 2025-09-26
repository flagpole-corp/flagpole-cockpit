import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { FeatureFlag, UseFeatureFlagsOptions } from './types'
import { flagKeys } from './types'
import api from '~/lib/axios'

export const useFeatureFlags = (
  projectId: string,
  options: UseFeatureFlagsOptions = {}
): UseQueryResult<FeatureFlag[], Error> => {
  return useQuery({
    queryKey: flagKeys.list(projectId),
    queryFn: async () => {
      const { data } = await api.get<FeatureFlag[]>('/api/feature-flags', {
        headers: {
          'x-project-id': projectId,
        },
      })
      return data
    },
    enabled: projectId !== '' && options.enabled !== false,
  })
}
