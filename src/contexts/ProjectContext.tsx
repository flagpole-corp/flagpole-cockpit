import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '~/lib/axios'
import { useAuth } from './AuthContext'

interface Project {
  id: string
  name: string
  description: string
  organization: string
}

interface ProjectContextType {
  currentProject: Project | null
  isLoading: boolean
  error: Error | null
}

const ProjectContext = createContext<ProjectContextType | null>(null)

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (organizationId: string) => [...projectKeys.lists(), organizationId] as const,
}

export const ProjectProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const { user } = useAuth()
  const organizationId = user?.currentOrganization

  const { data: projects, isLoading } = useQuery({
    queryKey: projectKeys.list(organizationId || ''), // Always provide a string
    queryFn: async () => {
      if (!organizationId) {
        throw new Error('No organization selected')
      }

      const { data } = await api.get<Project[]>('/api/projects', {
        headers: {
          'x-organization-id': organizationId,
        },
      })
      return data
    },
    enabled: !!organizationId, // Only run query when we have an organizationId
  })

  const currentProject = projects?.[0] ?? null

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        isLoading,
        error: null,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
