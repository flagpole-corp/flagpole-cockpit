import type { InviteUserDto, UsersControllerInviteData, UsersControllerUpdateUserData } from '@flagpole/api-types'
import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '~/lib/axios'
import type { UpdateUserRequest } from './types'
import { userKeys } from './types'

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
