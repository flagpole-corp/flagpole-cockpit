import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { ApiKey } from './types'
import { apiKeyKeys } from './types'
import { useAuthStore } from '~/stores/auth.store'
import api from '~/lib/axios'

export const useApiKeys = (projectId: string): UseQueryResult<ApiKey[], Error> => {
  const { user } = useAuthStore()
  const organizationId = user?.currentOrganization

  return useQuery({
    queryKey: apiKeyKeys.list(projectId, organizationId),
    queryFn: async () => {
      const { data } = await api.get<ApiKey[]>('/api/api-keys', {
        headers: {
          'x-project-id': projectId,
          'x-organization-id': organizationId,
        },
      })
      return data
    },
    enabled: !!projectId && !!organizationId,
  })
}
