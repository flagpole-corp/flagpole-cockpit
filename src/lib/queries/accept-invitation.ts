import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import api from '~/lib/axios'

export interface AcceptInvitationResponse {
  success: boolean
}

export const useAcceptInvitation = (): UseMutationResult<
  AcceptInvitationResponse,
  Error,
  { token: string; password: string }
> => {
  return useMutation({
    mutationFn: async ({ token, password }) => {
      const { data } = await api.post<AcceptInvitationResponse>('/api/users/accept-invitation', {
        token,
        password,
      })
      return data
    },
    onSuccess: () => {
      toast.success('Account setup complete! You can now sign in.')
    },
    onError: () => {
      toast.error('Failed to accept invitation. The link may be expired or invalid.')
    },
  })
}
