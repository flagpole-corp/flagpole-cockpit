// ~/pages/activity-logs/index.tsx
import { useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useActivityLogs } from '~/lib/api/activity-logs'
import { ActivityLogsPageHeader, ActivityLogsDataGrid, ActivityLogsFilters } from './components'
import { useActivityLogsTableColumns, useActivityLogsFilters } from './hooks'
import type { ActivityLogFilters } from '~/lib/api/activity-logs/types'

export const ActivityLogs = (): JSX.Element => {
  const [filters, setFilters] = useState<ActivityLogFilters>({
    limit: 50,
    skip: 0,
  })

  const { data: activityLogs, isLoading } = useActivityLogs(filters)

  const columns = useActivityLogsTableColumns()
  const { filterOptions, handleFilterChange } = useActivityLogsFilters({
    filters,
    onFiltersChange: setFilters,
  })

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box width="100%">
      <ActivityLogsPageHeader />

      <ActivityLogsFilters filters={filters} filterOptions={filterOptions} onFilterChange={handleFilterChange} />

      <ActivityLogsDataGrid activityLogs={activityLogs} columns={columns} isLoading={isLoading} />
    </Box>
  )
}

export default ActivityLogs
