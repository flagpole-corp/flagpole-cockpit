import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useDrawer } from '~/contexts/DrawerContext'
import { useAuthStore } from '~/stores/auth.store'
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

interface UpdateFeatureFlagVariables {
  id: string
  data: Partial<CreateFeatureFlag>
}

interface DeleteFeatureFlagVariables {
  id: string
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
    onSuccess: () => {
      toast.success('Feature flag updated successfully')
    },
    onError: (_, variables, context) => {
      if (context?.previousFlags) {
        queryClient.setQueryData(flagKeys.list(variables.projectId), context.previousFlags)
      }
      toast.error('Failed to update flag')
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
  const { user } = useAuthStore()
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

export const useUpdateFeatureFlag = (): UseMutationResult<FeatureFlag, Error, UpdateFeatureFlagVariables> => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const organizationId = user?.currentOrganization
  const { closeDrawer } = useDrawer()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const { data: response } = await api.patch<FeatureFlag>(`/api/feature-flags/${id}`, data, {
        headers: {
          'x-project-id': data.projectId,
          'x-organization-id': organizationId,
        },
      })
      return response
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: flagKeys.list(variables.data.projectId!),
      })
      closeDrawer()
      toast.success('Feature flag updated successfully')
    },
  })
}

export const useDeleteFeatureFlag = (): UseMutationResult<void, Error, DeleteFeatureFlagVariables> => {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const organizationId = user?.currentOrganization

  return useMutation({
    mutationFn: async ({ id, projectId }) => {
      await api.delete(`/api/feature-flags/${id}`, {
        headers: {
          'x-project-id': projectId,
          'x-organization-id': organizationId,
        },
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: flagKeys.list(variables.projectId),
      })
      toast.success('Feature flag deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete feature flag')
    },
  })
}
