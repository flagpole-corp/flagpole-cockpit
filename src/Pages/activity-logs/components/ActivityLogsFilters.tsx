// ~/pages/activity-logs/components/ActivityLogsFilters.tsx
import { Box, Grid, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material'
import type { ActivityLogFilters } from '~/lib/api/activity-logs/types'

interface ActivityLogsFiltersProps {
  filters: ActivityLogFilters
  filterOptions: {
    projects: Array<{ value: string; label: string }>
    users: Array<{ value: string; label: string }>
    entityTypes: Array<{ value: string; label: string }>
    actions: Array<{ value: string; label: string }>
  }
  onFilterChange: (filters: ActivityLogFilters) => void
}

export const ActivityLogsFilters = ({
  filters,
  filterOptions,
  onFilterChange,
}: ActivityLogsFiltersProps): JSX.Element => {
  const handleFilterChange = (key: keyof ActivityLogFilters, value: unknown): void => {
    onFilterChange({
      ...filters,
      [key]: value,
      skip: 0, // Reset pagination when filters change
    })
  }

  return (
    <Box mb={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Project</InputLabel>
            <Select
              value={filters.projectId || ''}
              label="Project"
              onChange={(e): void => handleFilterChange('projectId', e.target.value || undefined)}
            >
              <MenuItem value="">All Projects</MenuItem>
              {filterOptions.projects.map((project) => (
                <MenuItem key={project.value} value={project.value}>
                  {project.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Entity Type</InputLabel>
            <Select
              value={filters.entityType || ''}
              label="Entity Type"
              onChange={(e): void => handleFilterChange('entityType', e.target.value || undefined)}
            >
              <MenuItem value="">All Types</MenuItem>
              {filterOptions.entityTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Action</InputLabel>
            <Select
              value={filters.action || ''}
              label="Action"
              onChange={(e): void => handleFilterChange('action', e.target.value || undefined)}
            >
              <MenuItem value="">All Actions</MenuItem>
              {filterOptions.actions.map((action) => (
                <MenuItem key={action.value} value={action.value}>
                  {action.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>User</InputLabel>
            <Select
              value={filters.userId || ''}
              label="User"
              onChange={(e): void => handleFilterChange('userId', e.target.value || undefined)}
            >
              <MenuItem value="">All Users</MenuItem>
              {filterOptions.users.map((user) => (
                <MenuItem key={user.value} value={user.value}>
                  {user.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            size="small"
            label="Limit"
            type="number"
            value={filters.limit}
            onChange={(e): void => handleFilterChange('limit', parseInt(e.target.value) || 50)}
            inputProps={{ min: 1, max: 100 }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
