import type { ReactNode, SyntheticEvent } from 'react'
import { useState } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Tabs,
  Tab,
  Chip,
  Switch,
  Tooltip,
  IconButton,
  Popover,
  TextField,
  Alert,
  Stack,
} from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import { useFeatureFlags, useToggleFeatureFlag } from '~/lib/queries/flags'
import { useProjects } from '~/lib/queries/projects'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import KeyIcon from '@mui/icons-material/Key'
import { useApiKeys, useCreateApiKey } from '~/lib/queries/api-keys'
import { useSearchParams } from 'react-router-dom'

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
  const [searchParams, setSearchParams] = useSearchParams()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const { data: projects, isLoading: projectsLoading } = useProjects()

  const currentProjectId = searchParams.get('projectId') || projects?.[0]?._id
  const currentProject = projects?.find((p) => p._id === currentProjectId)
  const currentTabIndex = projects?.findIndex((p) => p._id === currentProjectId) ?? 0

  const { data: flags, isLoading: flagsLoading } = useFeatureFlags(currentProjectId ?? '', {
    enabled: !!currentProjectId,
  })

  const { data: apiKeys, isLoading: apiKeysLoading } = useApiKeys(currentProjectId ?? '')
  const createApiKey = useCreateApiKey()

  const toggleMutation = useToggleFeatureFlag()

  const handleToggleFlag = async (flagId: string): Promise<void> => {
    if (!currentProjectId) return

    try {
      await toggleMutation.mutateAsync({
        flagId,
        projectId: currentProjectId,
      })
      toast.success('Flag updated successfully')
    } catch (error) {
      toast.error('Failed to update flag')
      console.error('Failed to toggle flag:', error)
    }
  }

  const handleCreateApiKey = async (): Promise<void> => {
    if (!currentProject) return
    try {
      await createApiKey.mutateAsync({
        name: `API Key for ${currentProject.name}`,
        projectId: currentProject._id,
      })
      toast.success('API key created successfully')
      // eslint-disable-next-line
    } catch (error) {
      toast.error('Failed to create API key')
    }
  }

  const handleCopyKey = (key: string): void => {
    navigator.clipboard.writeText(key)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  const renderApiKeySection = (): ReactNode => {
    if (apiKeysLoading || createApiKey.isPending) return null

    if (!apiKeys?.length) {
      return (
        <Alert
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<KeyIcon />}
              onClick={handleCreateApiKey}
              disabled={createApiKey.isPending}
            >
              Generate API Key
            </Button>
          }
        >
          No API key found for this project
        </Alert>
      )
    }

    return (
      <Box mb={2}>
        <Button
          onClick={(event): void => setAnchorEl(event.currentTarget)}
          startIcon={<KeyIcon />}
          variant="outlined"
          size="small"
        >
          Show API Key
        </Button>
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={(): void => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Box p={2} maxWidth={400}>
            <Typography variant="subtitle2" gutterBottom>
              API Key
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                size="small"
                value={apiKeys[0].key}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
              />
              <Tooltip title={copiedKey ? 'Copied!' : 'Copy to clipboard'}>
                <IconButton onClick={(): void => handleCopyKey(apiKeys[0].key)} size="small">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Popover>
      </Box>
    )
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
            /* todo */
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
    const projectId = projects?.[newValue]?._id
    if (projectId) {
      setSearchParams({ projectId })
    }
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
          <Stack spacing={2} sx={{ width: '100%' }}>
            {renderApiKeySection()}
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
          </Stack>
        </TabPanel>
      ))}
    </Box>
  )
}
