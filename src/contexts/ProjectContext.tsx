import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '~/lib/axios'

interface Project {
  id: string
  name: string
  description: string
  organization: string
}

interface ProjectContextType {
  currentProject: Project | null
  setCurrentProject: (project: Project) => void
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
  const { data: projects, isLoading } = useQuery({
    queryKey: projectKeys.lists(),
    queryFn: async () => {
      const { data } = await api.get<Project[]>('/api/projects')
      return data
    },
  })

  // Use the first project as default or handle project selection
  const currentProject = projects?.[0] ?? null

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        setCurrentProject: (): void => {
          /* TODO: Implement project switching */
        },
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
