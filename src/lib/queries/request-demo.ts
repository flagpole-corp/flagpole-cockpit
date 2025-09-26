import type { UseMutationResult } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import api from '~/lib/axios'

import { z } from 'zod'

export const requestDemoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  companyName: z.string().min(1, 'Company name is required'),
  notes: z.string().optional(),
})

export type RequestDemo = z.infer<typeof requestDemoSchema>

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
