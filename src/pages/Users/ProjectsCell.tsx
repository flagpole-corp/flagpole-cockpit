import { Box, Chip } from '@mui/material'
import type { Project } from '~/lib/queries/projects'

interface ProjectsCellProps {
  projects: Project[]
}

export const ProjectsCell = ({ projects }: ProjectsCellProps): JSX.Element => {
  return (
    <Box>
      {projects.map((project: Project) => (
        <Chip key={project._id} label={project.name} size="small" sx={{ mr: 0.5 }} />
      ))}
    </Box>
  )
}
