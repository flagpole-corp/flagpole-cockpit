import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useAuthStore } from '~/stores/auth.store'
import api from '~/lib/axios'

export interface ApiKey {
  _id: string
  key: string
  name: string
  project: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface CreateApiKeyDto {
  name: string
  projectId: string
}

export const apiKeyKeys = {
  all: ['api-keys'] as const,
  lists: () => [...apiKeyKeys.all, 'list'] as const,
  list: (projectId: string, organizationId?: string) => [...apiKeyKeys.lists(), projectId, organizationId] as const,
}

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

export const useCreateApiKey = (): UseMutationResult<ApiKey, Error, CreateApiKeyDto> => {
  const { user } = useAuthStore()
  const organizationId = user?.currentOrganization
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (createApiKeyDto: CreateApiKeyDto) => {
      const { data } = await api.post<ApiKey>('/api/api-keys', createApiKeyDto, {
        headers: {
          'x-project-id': createApiKeyDto.projectId,
          'x-organization-id': organizationId,
        },
      })
      return data
    },
    onSuccess: (newApiKey, variables) => {
      queryClient.setQueryData<ApiKey[]>(apiKeyKeys.list(variables.projectId, organizationId), (old) => {
        if (!old) return [newApiKey]
        return [...old, newApiKey]
      })
      toast.success('API key created successfully')
    },
    onError: () => {
      toast.error('Failed to create API key')
    },
  })
}
