import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useDrawer } from '~/contexts/DrawerContext'
import api from '~/lib/axios'

export interface FeatureFlag {
  _id: string
  name: string
  description: string
  isEnabled: boolean
  project: string
  conditions: Record<string, unknown>
  environments: string[]
  createdAt: string
  updatedAt: string
}

interface UseFeatureFlagsOptions {
  enabled?: boolean
}

interface ToggleFlagVariables {
  flagId: string
  projectId: string
}

interface ToggleFlagContext {
  previousFlags: FeatureFlag[] | undefined
}

interface CreateFeatureFlag {
  name: string
  description: string
  environments: string[]
  projectId: string
}

export const flagKeys = {
  all: ['flags'] as const,
  lists: () => [...flagKeys.all, 'list'] as const,
  list: (projectId: string) => [...flagKeys.lists(), projectId] as const,
}

export const useFeatureFlags = (
  projectId: string,
  options: UseFeatureFlagsOptions = {}
): UseQueryResult<FeatureFlag[], Error> => {
  return useQuery({
    queryKey: flagKeys.list(projectId),
    queryFn: async () => {
      const { data } = await api.get<FeatureFlag[]>('/api/feature-flags', {
        headers: {
          'x-project-id': projectId,
        },
      })
      return data
    },
    enabled: projectId !== '' && options.enabled !== false,
  })
}

export const useToggleFeatureFlag = (): UseMutationResult<
  FeatureFlag,
  Error,
  ToggleFlagVariables,
  ToggleFlagContext
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ flagId, projectId }: ToggleFlagVariables) => {
      const { data } = await api.patch<FeatureFlag>(
        `/api/feature-flags/${flagId}/toggle`,
        {},
        {
          headers: {
            'x-project-id': projectId,
          },
        }
      )
      return data
    },
    onMutate: async ({ flagId, projectId }) => {
      await queryClient.cancelQueries({
        queryKey: flagKeys.list(projectId),
      })

      const previousFlags = queryClient.getQueryData<FeatureFlag[]>(flagKeys.list(projectId))

      queryClient.setQueryData<FeatureFlag[]>(flagKeys.list(projectId), (old) => {
        if (!old) return old
        return old.map((flag) => {
          if (flag._id === flagId) {
            return { ...flag, isEnabled: !flag.isEnabled }
          }
          return flag
        })
      })

      return { previousFlags }
    },
    onError: (_, variables, context) => {
      if (context?.previousFlags) {
        queryClient.setQueryData(flagKeys.list(variables.projectId), context.previousFlags)
      }
    },
    onSettled: (_, __, { projectId }) => {
      queryClient.invalidateQueries({
        queryKey: flagKeys.list(projectId),
      })
    },
  })
}

export const useCreateFeatureFlag = (): UseMutationResult<FeatureFlag, Error, CreateFeatureFlag> => {
  const queryClient = useQueryClient()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const organizationId = user?.currentOrganization
  const { closeDrawer } = useDrawer()

  return useMutation({
    mutationFn: async (createFlagData) => {
      const { data } = await api.post<FeatureFlag>(
        '/api/feature-flags',
        {
          ...createFlagData,
          organizationId,
        },
        {
          headers: {
            'x-project-id': createFlagData.projectId,
            'x-organization-id': organizationId,
          },
        }
      )
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: flagKeys.list(variables.projectId),
      })
      closeDrawer()
      toast.success('Feature flag created successfully')
    },
  })
}
