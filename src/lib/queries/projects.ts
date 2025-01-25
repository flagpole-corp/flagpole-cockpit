import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import api from '~/lib/axios'

export interface Project {
  _id: string
  name: string
  description: string
  organization: string
  status: string
  updatedAt: string
  createdAt: string
}

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, id] as const,
}

export const useProjects = (): UseQueryResult<Project[], Error> => {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      const { data } = await api.get<Project[]>('/api/projects')
      return data
    },
  })
}

export const useCreateProject = (): UseMutationResult<Project, Error, { name: string; description?: string }> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.post<Project>('/api/projects', data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
      toast.success('Project created successfully')
    },
    onError: () => {
      toast.error('Oh! Something went wrong :(')
    },
  })
}

export const useUpdateProject = (): UseMutationResult<
  Project,
  Error,
  { id: string; data: { name: string; description?: string } }
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: response } = await api.patch<Project>(`/api/projects/${id}`, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}

export const useDeleteProject = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/projects/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() })
    },
  })
}
