export interface ApiKey {
  _id: string
  key: string
  name: string
  project: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateApiKeyDto {
  name: string
  projectId: string
}

export const apiKeyKeys = {
  all: ['api-keys'] as const,
  lists: () => [...apiKeyKeys.all, 'list'] as const,
  list: (projectId: string, organizationId?: string) => [...apiKeyKeys.lists(), projectId, organizationId] as const,
}
