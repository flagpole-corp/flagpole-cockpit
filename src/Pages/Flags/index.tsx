import type { ReactNode, SyntheticEvent } from 'react'
import { useState } from 'react'
import { Box, Typography, CircularProgress, Button, Tabs, Tab, Chip, Switch } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import { useFeatureFlags, useToggleFeatureFlag } from '~/lib/queries/flags'
import { useProjects } from '~/lib/queries/projects'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'

interface TabPanelProps {
  children?: ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps): JSX.Element => {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box mt={2}>{children}</Box>}
    </div>
  )
}

export const Flags = (): JSX.Element => {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const { data: projects, isLoading: projectsLoading } = useProjects()

  const currentProject = projects?.[currentTabIndex]
  const { data: flags, isLoading: flagsLoading } = useFeatureFlags(currentProject?._id ?? '', {
    enabled: !!currentProject,
  })

  const toggleMutation = useToggleFeatureFlag()

  const handleToggleFlag = async (flagId: string): Promise<void> => {
    if (!currentProject) return

    try {
      await toggleMutation.mutateAsync({
        flagId,
        projectId: currentProject._id,
      })
      toast.success('Flag updated successfully')
    } catch (error) {
      toast.error('Failed to update flag')
      console.error('Failed to toggle flag:', error)
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 200,
    },
    {
      field: 'isEnabled',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={(): Promise<void> => handleToggleFlag(params.row._id)}
          disabled={toggleMutation.isPending}
        />
      ),
    },
    {
      field: 'environments',
      headerName: 'Environments',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          {params.value.map((env: string) => (
            <Chip key={env} label={env} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
          ))}
        </Box>
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 1,
      minWidth: 150,
      renderCell: (row) => formatDistanceToNow(row.value, { addSuffix: true }),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: () => (
        <Button
          size="small"
          onClick={(): void => {
            /* TODO: Open edit modal */
          }}
        >
          Edit
        </Button>
      ),
    },
  ]

  const isLoading = projectsLoading

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (!projects?.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>No projects found</Typography>
      </Box>
    )
  }

  const handleTabChange = (_: SyntheticEvent, newValue: number): void => {
    setCurrentTabIndex(newValue)
  }

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Feature Flags
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={(): void => {
            /* TODO: Open create flag modal */
          }}
        >
          Create Flag
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTabIndex}
          onChange={handleTabChange}
          aria-label="project tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          {projects.map((project) => (
            <Tab
              key={project._id}
              label={project.name}
              id={`project-tab-${project._id}`}
              aria-controls={`project-tabpanel-${project._id}`}
            />
          ))}
        </Tabs>
      </Box>

      {projects.map((project, index) => (
        <TabPanel key={project._id} value={currentTabIndex} index={index}>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={flags ?? []}
              columns={columns}
              disableColumnMenu
              getRowId={(row): string => row._id}
              loading={flagsLoading}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
            />
          </Box>
        </TabPanel>
      ))}
    </Box>
  )
}
