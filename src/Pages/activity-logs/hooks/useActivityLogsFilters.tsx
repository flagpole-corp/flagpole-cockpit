// ~/pages/activity-logs/hooks/useActivityLogsFilters.tsx
import { useProjects } from '~/lib/api/projects'
import { useUsers } from '~/lib/api/users'
import type { ActivityLogFilters } from '~/lib/api/activity-logs/types'

interface UseActivityLogsFiltersProps {
  filters: ActivityLogFilters
  onFiltersChange: (filters: ActivityLogFilters) => void
}

export const useActivityLogsFilters = ({ filters, onFiltersChange }: UseActivityLogsFiltersProps): any => {
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
      { value: 'feature-flag', label: 'Feature Flag' },
      { value: 'user', label: 'User' },
    ],

    actions: [
      { value: 'created', label: 'Created' },
      { value: 'updated', label: 'Updated' },
      { value: 'deleted', label: 'Deleted' },
      { value: 'toggled', label: 'Toggled' },
    ],
  }

  const handleFilterChange = (key: keyof ActivityLogFilters, value: any): void => {
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
