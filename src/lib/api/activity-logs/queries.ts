// ~/lib/api/activity-logs/queries.ts
import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type {
  ActivityLog,
  ActivityLogResponse,
  ProjectActivityLogResponse,
  FeatureFlagActivityResponse,
  EntityActivityResponse,
  ActivityLogFilters,
} from './types'
import { activityLogKeys } from './types'
import api from '~/lib/axios'

export const useActivityLogs = (filters: ActivityLogFilters = {}): UseQueryResult<ActivityLog[], Error> => {
  return useQuery({
    queryKey: activityLogKeys.list(filters),
    queryFn: async (): Promise<ActivityLog[]> => {
      const params = new URLSearchParams()

      if (filters.projectId) params.append('projectId', filters.projectId)
      if (filters.entityType) params.append('entityType', filters.entityType)
      if (filters.action) params.append('action', filters.action)
      params.append('limit', (filters.limit || 50).toString())
      params.append('skip', (filters.skip || 0).toString())

      const { data } = await api.get<ActivityLogResponse>(`/api/activity-logs?${params.toString()}`)
      return data?.activities || []
    },
  })
}

export const useProjectActivityLogs = (projectId: string, limit: number = 20): UseQueryResult<ActivityLog[], Error> => {
  return useQuery({
    queryKey: activityLogKeys.project(projectId, limit),
    queryFn: async (): Promise<ActivityLog[]> => {
      const { data } = await api.get<ProjectActivityLogResponse>(
        `/api/activity-logs/project/${projectId}?limit=${limit}`
      )
      return data?.activities || []
    },
  })
}

export const useFeatureFlagActivities = (flagId: string, limit: number = 20): UseQueryResult<ActivityLog[], Error> => {
  return useQuery({
    queryKey: activityLogKeys.featureFlag(flagId, limit),
    queryFn: async (): Promise<ActivityLog[]> => {
      const { data } = await api.get<FeatureFlagActivityResponse>(
        `/api/activity-logs/feature-flag/${flagId}?limit=${limit}`
      )
      return data?.activities || []
    },
  })
}

export const useEntityActivities = (
  entityType: string,
  entityId: string,
  limit: number = 20
): UseQueryResult<ActivityLog[], Error> => {
  return useQuery({
    queryKey: activityLogKeys.entity(entityType, entityId, limit),
    queryFn: async (): Promise<ActivityLog[]> => {
      const { data } = await api.get<EntityActivityResponse>(
        `/api/activity-logs/entity/${entityType}/${entityId}?limit=${limit}`
      )
      return data?.activities || []
    },
  })
}
