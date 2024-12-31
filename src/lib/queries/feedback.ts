import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import api from '~/lib/axios'

interface Feedback {
  type: 'bug' | 'feature' | 'other'
  title: string
  description: string
}

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
