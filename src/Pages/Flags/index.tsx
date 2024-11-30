import type { ReactNode, SyntheticEvent } from 'react'
import { useState } from 'react'
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Typography,
  CircularProgress,
  Chip,
  Button,
  Tabs,
  Tab,
} from '@mui/material'
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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
      // Handle error (show toast, etc.)
      console.error('Failed to toggle flag:', error)
    }
  }

  const isLoading = projectsLoading || flagsLoading

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
    <Box width="100%" maxWidth="1200px">
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
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Environments</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {flags?.map((flag) => (
                  <TableRow key={flag._id}>
                    <TableCell component="th" scope="row">
                      {flag.name}
                    </TableCell>
                    <TableCell>{flag.description}</TableCell>
                    <TableCell>
                      <Switch
                        checked={flag.isEnabled}
                        onChange={(): Promise<void> => handleToggleFlag(flag._id)}
                        disabled={toggleMutation.isPending}
                      />
                    </TableCell>
                    <TableCell>
                      {flag.environments.map((env) => (
                        <Chip key={env} label={env} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </TableCell>
                    <TableCell>{formatDistanceToNow(new Date(flag.updatedAt), { addSuffix: true })}</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={(): void => {
                          /* TODO: Open edit modal */
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      ))}
    </Box>
  )
}
