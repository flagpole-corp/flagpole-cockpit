import { z } from 'zod'

export const requestDemoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  companyName: z.string().min(1, 'Company name is required'),
  notes: z.string().optional(),
})

export type RequestDemo = z.infer<typeof requestDemoSchema>
