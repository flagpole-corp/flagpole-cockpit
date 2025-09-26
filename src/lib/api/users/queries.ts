import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { User } from './types'
import { userKeys } from './types'
import api from '~/lib/axios'
import type { UsersControllerFindAllData } from '@flagpole/api-types'

export const useUsers = (): UseQueryResult<User[], Error> => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: async (): Promise<User[]> => {
      const { data } = await api.get<UsersControllerFindAllData>('/api/users')
      return data || []
    },
  })
}
