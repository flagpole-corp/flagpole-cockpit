import type { InviteUserDto, UsersControllerFindAllData } from '@flagpole/api-types'

export type User = NonNullable<UsersControllerFindAllData>[number]
export type OrganizationRole = InviteUserDto['role']

export interface UpdateUserRequest {
  id: string
  role?: OrganizationRole
  projects?: string[]
  firstName?: string
  lastName?: string
}

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
}
