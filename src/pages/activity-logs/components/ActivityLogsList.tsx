import { Box, List, Divider, CircularProgress, Alert } from '@mui/material'
import { ActivityLogItem } from './ActivityLogItem'
import type { ActivityLog } from '~/lib/api/activity-logs/types'

interface ActivityLogsListProps {
  activityLogs: ActivityLog[]
  isLoading: boolean
}

export const ActivityLogsList = ({ activityLogs, isLoading }: ActivityLogsListProps): JSX.Element => {
  if (!activityLogs?.length && !isLoading) {
    return <Alert severity="info">No activity logs found.</Alert>
  }

  return (
    <Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {activityLogs.map((log, index) => (
          <Box key={log._id}>
            <ActivityLogItem log={log} />
            {index < activityLogs.length - 1 && <Divider variant="inset" component="li" />}
          </Box>
        ))}
      </List>

      {isLoading && (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  )
}
