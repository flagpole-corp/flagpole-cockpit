import { useState } from 'react'
import { Box, CircularProgress, Alert } from '@mui/material'
import { useActivityLogs } from '~/lib/api/activity-logs'
import { ActivityLogsPageHeader, ActivityLogsFilters, ActivityLogsList } from './components'
import { useActivityLogsFilters } from './hooks'
import type { ActivityLogFilters } from '~/lib/api/activity-logs/types'

export const ActivityLogs = (): JSX.Element => {
  const [filters, setFilters] = useState<ActivityLogFilters>({
    limit: 50,
    skip: 0,
  })

  const { data: activityLogs, isLoading, error } = useActivityLogs(filters)

  const { filterOptions, handleFilterChange } = useActivityLogsFilters({
    filters,
    onFiltersChange: setFilters,
  })

  return (
    <Box width="100%">
      <ActivityLogsPageHeader />

      <ActivityLogsFilters filters={filters} filterOptions={filterOptions} onFilterChange={handleFilterChange} />

      {isLoading && !activityLogs && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box width="100%">
          <ActivityLogsPageHeader />
          <Alert severity="error">Failed to load activity logs: {error.message}</Alert>
        </Box>
      )}

      <ActivityLogsList activityLogs={activityLogs || []} isLoading={isLoading} />
    </Box>
  )
}

export default ActivityLogs
