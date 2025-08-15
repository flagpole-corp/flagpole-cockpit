import { useState } from 'react'
import { Box, Typography, CircularProgress, Button, IconButton, Stack, Alert } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'react-toastify'
import { useDrawer } from '~/contexts/DrawerContext'
import { Form } from '~/components/Form'
import { FormTextField } from '~/components/FormTextField'
import { z } from 'zod'
import { DeleteConfirmationDialog } from '~/components/DeleteConfirmationDialog'
import type { Project } from '~/lib/queries/projects'
import { useProjects, useUpdateProject, useCreateProject, useDeleteProject } from '~/lib/queries/projects'

const createProjectSchema = z.object({
  name: z.string().min(3, 'Min length is 3').max(255, 'Max length is 256'),
  description: z.string().max(1000, 'max length is 1000').optional(),
})

type CreateProjectFormData = z.infer<typeof createProjectSchema>

const Projects = (): JSX.Element => {
  const { openDrawer, closeDrawer } = useDrawer()
  const [projectToDelete, setProjectToDelete] = useState<{ id: string; name: string } | null>(null)

  const { data: projects, isLoading } = useProjects()
  const updateProject = useUpdateProject()
  const createProject = useCreateProject()
  const deleteProject = useDeleteProject()

  const handleEdit = (project: Project): void => {
    openDrawer({
      content: (
        <Form<CreateProjectFormData>
          onSubmit={async (data): Promise<void> => {
            await updateProject.mutateAsync({ id: project._id, data })
            closeDrawer()
            toast.success('Project updated successfully')
          }}
          onCancel={closeDrawer}
          schema={createProjectSchema}
          defaultValues={{
            name: project.name,
            description: project.description,
          }}
        >
          {(control): JSX.Element => (
            <Stack spacing={2}>
              <FormTextField
                control={control}
                name="name"
                label="Name"
                placeholder="my-project"
                fullWidth
                helperText="Only letters, numbers, hyphens, and underscores"
              />

              <FormTextField
                control={control}
                name="description"
                label="Description"
                placeholder="Describe your project"
                fullWidth
                multiline
                rows={3}
              />

              <Button
                color="error"
                onClick={(): void => {
                  closeDrawer()
                  setProjectToDelete({ id: project._id, name: project.name })
                }}
              >
                Delete Project
              </Button>
            </Stack>
          )}
        </Form>
      ),
      title: 'Edit Project',
    })
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
      field: 'updatedAt',
      headerName: 'Last Updated',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => formatDistanceToNow(new Date(params.value), { addSuffix: true }),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" height="100%" alignItems="center" gap={1}>
          <IconButton size="small" onClick={(): void => handleEdit(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(): void =>
              setProjectToDelete({
                id: params.row._id,
                name: params.row.name,
              })
            }
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ]

  const handleOpenCreateDrawer = (): void => {
    openDrawer({
      content: (
        <Form<CreateProjectFormData>
          onSubmit={async (data): Promise<void> => {
            await createProject.mutateAsync(data)
            closeDrawer()
          }}
          onCancel={closeDrawer}
          schema={createProjectSchema}
        >
          {(control): JSX.Element => (
            <Stack spacing={2}>
              <FormTextField
                control={control}
                name="name"
                label="Name"
                placeholder="my-project"
                fullWidth
                helperText="Only letters, numbers, hyphens, and underscores"
              />

              <FormTextField
                control={control}
                name="description"
                label="Description"
                placeholder="Describe your project"
                fullWidth
                multiline
                rows={3}
              />
            </Stack>
          )}
        </Form>
      ),
      title: 'Create Project',
    })
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          Projects
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDrawer}>
          Create Project
        </Button>
      </Box>

      <Stack spacing={2}>
        {!projects?.length ? (
          <Alert severity="info">No projects found. Create your first project to get started.</Alert>
        ) : (
          <DataGrid
            rows={projects}
            columns={columns}
            disableColumnMenu
            disableRowSelectionOnClick
            getRowId={(row): string => row._id}
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
          />
        )}
      </Stack>

      <DeleteConfirmationDialog
        open={!!projectToDelete}
        onClose={(): void => setProjectToDelete(null)}
        onConfirm={async (): Promise<void> => {
          if (projectToDelete) {
            await deleteProject.mutateAsync(projectToDelete.id)
            setProjectToDelete(null)
            toast.success('Project delete successfully')
          }
        }}
        title="Delete Project"
        description={`Are you sure you want to delete "${projectToDelete?.name}"?`}
        isLoading={deleteProject.isPending}
      />
    </Box>
  )
}

export default Projects
