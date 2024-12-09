import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
  list: (projectId: string) => [...apiKeyKeys.lists(), projectId] as const,
}

export const useApiKeys = (projectId: string): UseQueryResult<ApiKey[], Error> => {
  return useQuery({
    queryKey: apiKeyKeys.list(projectId),
    queryFn: async () => {
      const { data } = await api.get<ApiKey[]>('/api/api-keys', {
        headers: {
          'x-project-id': projectId,
        },
      })
      return data
    },
    enabled: !!projectId,
  })
}

export const useCreateApiKey = (): UseMutationResult<ApiKey, Error, CreateApiKeyDto> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (createApiKeyDto: CreateApiKeyDto) => {
      const { data } = await api.post<ApiKey>('/api/api-keys', createApiKeyDto, {
        headers: {
          'x-project-id': createApiKeyDto.projectId,
        },
      })
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: apiKeyKeys.list(variables.projectId),
      })
    },
  })
}