import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { userKeys, type UserProfile } from './types'
import api from '~/lib/axios'

export const useUserProfile = (): UseQueryResult<UserProfile, Error> => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const { data } = await api.get<UserProfile>('/api/users/profile')
      return data
    },
  })
}
