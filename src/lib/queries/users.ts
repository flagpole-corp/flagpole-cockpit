import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '~/lib/axios'
import type {
  InviteUserDto,
  UsersControllerFindAllData,
  UsersControllerInviteData,
  UsersControllerUpdateUserData,
} from '@flagpole/api-types'

export type User = NonNullable<UsersControllerFindAllData>[number]
export type OrganizationRole = InviteUserDto['role']

export interface UpdateUserRequest {
  id: string
  role?: OrganizationRole
  projects?: string[]
  firstName?: string
  lastName?: string
}

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
}

export const useUsers = (): UseQueryResult<User[], Error> => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async (): Promise<User[]> => {
      const { data } = await api.get<UsersControllerFindAllData>('/api/users')
      return data || []
    },
  })
}

export const useInviteUser = (): UseMutationResult<UsersControllerInviteData, Error, InviteUserDto> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: InviteUserDto): Promise<UsersControllerInviteData> => {
      const { data: response } = await api.post<UsersControllerInviteData>('/api/users/invite', data)
      return response
    },
    onSuccess: (): void => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export const useUpdateUser = (): UseMutationResult<UsersControllerUpdateUserData, Error, UpdateUserRequest> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateUserRequest): Promise<UsersControllerUpdateUserData> => {
      const { id, ...updateData } = data
      const { data: response } = await api.patch<UsersControllerUpdateUserData>(`/api/users/${id}`, updateData)
      return response
    },
    onSuccess: (): void => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export const useDeleteUser = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      await api.delete(`/api/users/${userId}`)
    },
    onSuccess: (): void => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export const useResendInvitation = (): UseMutationResult<void, Error, string> => {
  return useMutation({
    mutationFn: async (userId: string): Promise<void> => {
      await api.post(`/api/users/${userId}/resend-invitation`)
    },
  })
}
