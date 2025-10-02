import { useProjects } from '~/lib/api/projects'
import { useUsers } from '~/lib/api/users'
import type { ActivityLogFilters } from '~/lib/api/activity-logs/types'

interface UseActivityLogsFiltersProps {
  filters: ActivityLogFilters
  onFiltersChange: (filters: ActivityLogFilters) => void
}

interface FilterOption {
  value: string
  label: string
}

interface UseActivityLogsFiltersReturn {
  filterOptions: {
    projects: FilterOption[]
    users: FilterOption[]
    entityTypes: FilterOption[]
    actions: FilterOption[]
  }
  handleFilterChange: (key: keyof ActivityLogFilters, value: string | number | undefined) => void
}

export const useActivityLogsFilters = ({
  filters,
  onFiltersChange,
}: UseActivityLogsFiltersProps): UseActivityLogsFiltersReturn => {
  const { data: projects } = useProjects()
  const { data: users } = useUsers()

  const filterOptions = {
    projects:
      projects?.map((project) => ({
        value: project._id,
        label: project.name,
      })) || [],

    users:
      users?.map((user) => ({
        value: user._id,
        label: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
      })) || [],

    entityTypes: [
      { value: 'project', label: 'Project' },
      { value: 'feature_flag', label: 'Feature Flag' },
    ],

    actions: [
      { value: 'feature_flag.created', label: 'Feature Flag Created' },
      { value: 'feature_flag.updated', label: 'Feature Flag Updated' },
      { value: 'feature_flag.deleted', label: 'Feature Flag Deleted' },
      { value: 'feature_flag.toggled', label: 'Feature Flag Toggled' },
      { value: 'project.created', label: 'Project Created' },
      { value: 'project.updated', label: 'Project Updated' },
      { value: 'project.deleted', label: 'Project Deleted' },
    ],
  }

  const handleFilterChange = (key: keyof ActivityLogFilters, value: string | number | undefined): void => {
    onFiltersChange({
      ...filters,
      [key]: value,
      skip: 0, // Reset pagination when filters change
    })
  }

  return {
    filterOptions,
    handleFilterChange,
  }
}
