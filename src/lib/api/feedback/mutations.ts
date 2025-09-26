import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import type { Feedback } from './types'
import api from '~/lib/axios'
import { toast } from 'react-toastify'

export const useSendFeedback = (): UseMutationResult<void, Error, Feedback> => {
  return useMutation({
    mutationFn: async (data: Feedback) => {
      await api.post('/api/feedback', data)
    },
    onSuccess: () => {
      toast.success('Feedback sent successfully. We will get back as soon as possible')
    },
    onError: (error) => {
      console.error({ error })
      toast.error('Feedback failed to be sent')
    },
  })
}
