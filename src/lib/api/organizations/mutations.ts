import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import type { CreateOrg, CreateOrganizationRequest } from './types'
import api from '~/lib/axios'

export const useCreateOrganization = (): UseMutationResult<CreateOrg, Error, CreateOrganizationRequest> => {
  return useMutation({
    mutationFn: async (data: CreateOrganizationRequest) => {
      const response = await api.post<CreateOrg>('/api/admin/organizations/create', data)
      return response.data
    },
  })
}
