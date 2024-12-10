import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import api from '~/lib/axios'

export interface Project {
  _id: string
  name: string
  description: string
  organization: string
}

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
}

export const useProjects = (): UseQueryResult<Project[], Error> => {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null')

      const { data } = await api.get<Project[]>('/api/projects', {
        headers: {
          'x-organization-id': user?.currentOrganization,
        },
      })
      return data
    },
  })
}
