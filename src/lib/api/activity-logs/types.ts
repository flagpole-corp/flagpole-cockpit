export interface ActivityLog {
  _id: string
  action: string
  entityType: string
  entityId: string
  entityName: string
  organization: string
  project?: string
  actor: {
    _id: string
    email: string
    firstName?: string
    lastName?: string
  }
  actorEmail: string
  actorName: string
  metadata?: {
    changes?: Array<{
      field: string
      oldValue: unknown
      newValue: unknown
    }>
    description?: string
    initialState?: unknown
    memberAdded?: unknown
    memberRemoved?: unknown
    memberRoleChanged?: unknown
  }
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface ActivityLogResponse {
  activities: ActivityLog[]
  total: number
}

export interface ProjectActivityLogResponse {
  activities: ActivityLog[]
  total: number
}

export interface FeatureFlagActivityResponse {
  activities: ActivityLog[]
  total: number
}

export interface EntityActivityResponse {
  activities: ActivityLog[]
  total: number
}

export interface ActivityLogFilters {
  projectId?: string
  entityType?: string
  action?: string
  userId?: string
  limit?: number
  skip?: number
}

export const activityLogKeys = {
  all: ['activity-logs'] as const,
  lists: (): readonly ['activity-logs', 'list'] => [...activityLogKeys.all, 'list'] as const,
  list: (filters: ActivityLogFilters): readonly ['activity-logs', 'list', ActivityLogFilters] =>
    [...activityLogKeys.lists(), filters] as const,
  project: (projectId: string, limit?: number): readonly (string | number)[] =>
    [...activityLogKeys.all, 'project', projectId, ...(limit ? [limit] : [])] as const,
  featureFlag: (flagId: string, limit?: number): readonly (string | number)[] =>
    [...activityLogKeys.all, 'feature-flag', flagId, ...(limit ? [limit] : [])] as const,
  entity: (entityType: string, entityId: string, limit?: number): readonly (string | number)[] =>
    [...activityLogKeys.all, 'entity', entityType, entityId, ...(limit ? [limit] : [])] as const,
}
