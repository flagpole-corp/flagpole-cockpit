import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { Project } from './types'
import { projectKeys } from './types'
import api from '~/lib/axios'

export const useProjects = (): UseQueryResult<Project[], Error> => {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      const { data } = await api.get<Project[]>('/api/projects')
      return data
    },
  })
}
