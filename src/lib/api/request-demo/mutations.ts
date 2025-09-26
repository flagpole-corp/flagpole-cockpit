import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import type { RequestDemo } from './types'
import api from '~/lib/axios'
import { toast } from 'react-toastify'

export const useRequestDemo = (): UseMutationResult<void, Error, RequestDemo> => {
  return useMutation({
    mutationFn: async (data: RequestDemo) => {
      await api.post('/api/onboarding/request-demo', data)
    },
    onSuccess: () => {
      toast.success('Demo request submitted successfully. Our team will contact you shortly.')
    },
  })
}
