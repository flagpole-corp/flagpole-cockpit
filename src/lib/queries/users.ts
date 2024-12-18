import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '~/lib/axios'

export type OrganizationRole = 'owner' | 'admin' | 'member'

export interface User {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  status: string
  organizationRole: string
  organizations: Array<{
    organization: string
    role: string
    joinedAt: string
  }>
  projects: Array<{
    _id: string
    name: string
    addedAt: string
  }>
}

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
}

export const useUsers = (): UseQueryResult<User[], Error> => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const { data } = await api.get<User[]>('/api/users')
      return data
    },
  })
}

export const useInviteUser = (): UseMutationResult<
  User,
  Error,
  { email: string; role?: OrganizationRole; projects?: string[] }
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      const { data: response } = await api.post<User>('/api/users/invite', data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export const useUpdateUserRole = (): UseMutationResult<User, Error, { id: string; role: OrganizationRole }> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, role }) => {
      const { data } = await api.patch<User>(`/api/users/${id}/role`, { role })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export const useUpdateUserProjects = (): UseMutationResult<User, Error, { id: string; projects: string[] }> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, projects }) => {
      const { data } = await api.patch<User>(`/api/users/${id}/projects`, { projects })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
