import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import api from '~/lib/axios'
import type { CreateOrganizationRequest } from '~/types/organization'

export const useCreateOrganization = (): UseMutationResult<> => {
  return useMutation({
    mutationFn: async (data: CreateOrganizationRequest) => {
      const response = await api.post('/api/admin/organizations/create', data)
      return response.data
    },
  })
}
