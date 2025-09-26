import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Project } from './types'
import { projectKeys } from './types'
import api from '~/lib/axios'
import { toast } from 'react-toastify'

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
