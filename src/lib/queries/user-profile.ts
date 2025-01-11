import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '~/lib/axios'
import { authKeys, type User } from './auth'
import { useAuthStore } from '~/stores/auth.store'
import { toast } from 'react-toastify'

export interface UserProfile {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  provider: 'local' | 'google'
  avatar?: string
  status: 'pending' | 'active' | 'inactive'
  organizations: Array<{
    organization: string
    role: 'owner' | 'admin' | 'member'
    joinedAt: Date
    removedAt?: Date
  }>
  currentOrganization?: string
  projects: Array<{
    project: string
    addedAt: Date
  }>
  fullName?: string
}

export interface UpdateProfileDto {
  firstName?: string
  lastName?: string
}

const userKeys = {
  all: ['users'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
}

export const useUserProfile = (): UseQueryResult<UserProfile, Error> => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const { data } = await api.get<UserProfile>('/api/users/profile')
      return data
    },
  })
}

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
