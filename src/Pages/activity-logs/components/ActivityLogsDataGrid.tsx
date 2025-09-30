// ~/pages/activity-logs/components/ActivityLogsDataGrid.tsx
import { Stack, Alert } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import type { ActivityLog } from '~/lib/api/activity-logs/types'

interface ActivityLogsDataGridProps {
  activityLogs: ActivityLog[] | undefined
  columns: GridColDef<ActivityLog>[]
  isLoading: boolean
  onLoadMore?: () => void
  hasMore?: boolean
}

export const ActivityLogsDataGrid = ({ activityLogs, columns, isLoading }: ActivityLogsDataGridProps): JSX.Element => {
  if (!activityLogs?.length && !isLoading) {
    return <Alert severity="info">No activity logs found.</Alert>
  }

  return (
    <Stack spacing={2}>
      <DataGrid<ActivityLog>
        rows={activityLogs || []}
        columns={columns}
        disableColumnMenu
        disableRowSelectionOnClick
        getRowId={(row): string => row._id}
        loading={isLoading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        autoHeight
      />
    </Stack>
  )
}
