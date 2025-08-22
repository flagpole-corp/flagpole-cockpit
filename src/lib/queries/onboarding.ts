import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import api from '../axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export interface AcceptInvitationResponse {
  success: boolean
}

export const useAcceptInvitation = (): UseMutationResult<
  AcceptInvitationResponse,
  Error,
  { token: string; password: string }
> => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ token, password }) => {
      const { data } = await api.post<AcceptInvitationResponse>('/api/onboarding/accept-invitation', {
        token,
        password,
      })
      return data
    },
    onSuccess: () => {
      toast.success('Account setup complete! You can now sign in.')
      navigate('/signin')
    },
  })
}
