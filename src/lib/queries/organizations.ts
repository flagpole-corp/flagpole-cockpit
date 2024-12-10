import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import api from '~/lib/axios'
import type { CreateOrganizationRequest } from '~/types/organization'

type CreateOrg = {
  name: string
  slug: string
  settings?: Record<string, unknown>
}

export const useCreateOrganization = (): UseMutationResult<CreateOrg, Error, CreateOrganizationRequest> => {
  return useMutation({
    mutationFn: async (data: CreateOrganizationRequest) => {
      const response = await api.post<CreateOrg>('/api/admin/organizations/create', data)
      return response.data
    },
  })
}
