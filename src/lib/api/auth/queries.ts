import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useAuthStore } from '~/stores/auth.store'
import type { User } from './types'
import api from '~/lib/axios'

export const authKeys = {
  user: ['auth', 'user'] as const,
}

export const useUser = (): UseQueryResult<User, Error> => {
  const { token, user, setUser } = useAuthStore()

  return useQuery({
    queryKey: authKeys.user,
    queryFn: async () => {
      const { data } = await api.get<User>('/api/auth/me')
      setUser(data)
      return data
    },
    initialData: user,
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 min
  })
}
