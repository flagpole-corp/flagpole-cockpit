export interface UserProfile {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  provider: 'local' | 'google'
  avatar?: string
  status: 'pending' | 'active' | 'inactive'
  organizations: Array<{
    organization: string
    role: 'owner' | 'admin' | 'member'
    joinedAt: Date
    removedAt?: Date
  }>
  currentOrganization?: string
  projects: Array<{
    project: string
    addedAt: Date
  }>
  fullName?: string
}

export interface UpdateProfileDto {
  firstName?: string
  lastName?: string
}

export const userKeys = {
  all: ['users'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
}
