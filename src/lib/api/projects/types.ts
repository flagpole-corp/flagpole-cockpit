export interface Project {
  _id: string
  name: string
  description: string
  organization: string
  status: string
  updatedAt: string
  createdAt: string
}

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  detail: (id: string) => [...projectKeys.all, id] as const,
}
