import { Box, Typography } from '@mui/material'

export const ActivityLogsPageHeader = (): JSX.Element => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5" component="h1">
        Activity Log
      </Typography>
    </Box>
  )
}
