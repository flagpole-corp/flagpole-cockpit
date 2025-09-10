import { z } from 'zod'
import type { InviteUserDto, UpdateUserDto, OrganizationsControllerFindAllData } from '@flagpole/api-types'

export type BackendUser = NonNullable<OrganizationsControllerFindAllData>[number]
export type BackendInviteUserDto = InviteUserDto
export type BackendUpdateUserDto = UpdateUserDto

export interface UserToDelete {
  id: string
  email: string
}

export const inviteUserSchema = z.object({
  firstName: z.string().min(3, 'First name must be at least 3 characters'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  role: z.enum(['owner', 'admin', 'member'] as const, {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
  projects: z.array(z.string()).optional(),
}) satisfies z.ZodType<BackendInviteUserDto>

export const editUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(3, 'First name must be at least 3 characters'),
  lastName: z.string().optional(),
  role: z.enum(['owner', 'admin', 'member'] as const),
  projects: z.array(z.string()).optional(),
}) satisfies z.ZodType<Omit<BackendUpdateUserDto, 'firstName' | 'lastName'> & { email: string }>

export type InviteUserFormData = z.infer<typeof inviteUserSchema>
export type EditUserFormData = z.infer<typeof editUserSchema>

export const isValidRole = (role: string): role is NonNullable<BackendInviteUserDto['role']> => {
  return ['owner', 'admin', 'member'].includes(role)
}
