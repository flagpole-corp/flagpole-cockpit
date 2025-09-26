import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { User } from '../auth'
import { authKeys } from '../auth'
import type { UpdateProfileDto } from './types'
import { useAuthStore } from '~/stores/auth.store'
import api from '~/lib/axios'
import { toast } from 'react-toastify'

export const useUpdateProfile = (): UseMutationResult<User, Error, UpdateProfileDto, unknown> => {
  const setUser = useAuthStore((state) => state.setUser)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updateData: UpdateProfileDto) => {
      const { data } = await api.patch<User>('/api/users/profile', updateData)
      return data
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser)
      queryClient.setQueryData(authKeys.user, updatedUser)
      queryClient.invalidateQueries({ queryKey: authKeys.user })
      toast.success('Profile updated successfully')
    },
    onError: (err) => {
      console.error('Mutation error:', err)
      toast.error('Failed to update profile')
    },
  })
}
