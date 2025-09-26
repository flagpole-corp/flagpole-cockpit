import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ApiKey, CreateApiKeyDto } from './types'
import { apiKeyKeys } from './types'
import { useAuthStore } from '~/stores/auth.store'
import api from '~/lib/axios'
import { toast } from 'react-toastify'

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
