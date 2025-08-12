import { Box, Typography, CircularProgress, Button, IconButton, Stack, Alert, Chip } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import { toast } from 'react-toastify'
import { useDrawer } from '~/contexts/DrawerContext'
import { Form } from '~/components/Form'
import { FormTextField } from '~/components/FormTextField'
import { FormSelect } from '~/components/FormSelect'
import { FormCheckboxGroup } from '~/components/FormCheckboxGroup'
import { z } from 'zod'
import type { User, OrganizationRole } from '~/lib/queries/users'
import { useUsers, useInviteUser, useDeleteUser, useResendInvitation, useUpdateUser } from '~/lib/queries/users'
import type { Project } from '~/lib/queries/projects'
import { useProjects } from '~/lib/queries/projects'
import { useState } from 'react'
import { DeleteConfirmationDialog } from '~/components/DeleteConfirmationDialog'

const inviteUserSchema = z.object({
  firstName: z.string().min(3, 'First name must be at least 3 characters'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  role: z.enum(['owner', 'admin', 'member'], {
    errorMap: () => ({ message: 'Please select a role' }),
  }),
  projects: z.array(z.string()).optional(),
})

const editUserSchema = inviteUserSchema.pick({
  role: true,
  projects: true,
  email: true,
})

type InviteUserFormData = z.infer<typeof inviteUserSchema>
type EditUserFormData = z.infer<typeof editUserSchema>

const Users = (): JSX.Element => {
  const { openDrawer, closeDrawer } = useDrawer()
  const { data: users, isLoading } = useUsers()
  const { data: projects } = useProjects()
  const [userToDelete, setUserToDelete] = useState<{ id: string; email: string } | null>(null)
  const inviteUser = useInviteUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()
  const resendInvitation = useResendInvitation()

  const handleResendInvitation = async (userId: string): Promise<void> => {
    try {
      await resendInvitation.mutateAsync(userId)
      toast.success('Invitation resent successfully')
      // eslint-disable-next-line
    } catch (error) {
      toast.error('Failed to resend invitation')
    }
  }

  const handleEdit = (user: User): void => {
    openDrawer({
      content: (
        <Form<EditUserFormData>
          onSubmit={async (data): Promise<void> => {
            await updateUser.mutateAsync({
              id: user._id,
              role: data.role as OrganizationRole,
              projects: data.projects,
            })
            closeDrawer()
            toast.success('User updated successfully')
          }}
          onCancel={closeDrawer}
          schema={editUserSchema}
          defaultValues={{
            email: user.email,
            role: user.organizations[0].role as OrganizationRole,
            projects: user.projects.map((project) => project._id),
          }}
        >
          {(control): JSX.Element => (
            <Stack spacing={2}>
              <FormTextField control={control} name="email" label="Email" disabled fullWidth />

              <FormSelect
                control={control}
                name="role"
                label="Role"
                options={[
                  { value: 'owner', label: 'Owner' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'member', label: 'Member' },
                ]}
                fullWidth
              />

              <FormCheckboxGroup
                control={control}
                name="projects"
                label="Projects Access"
                options={
                  projects?.map((project) => ({
                    value: project._id,
                    label: project.name,
                  })) ?? []
                }
              />
            </Stack>
          )}
        </Form>
      ),
      title: 'Edit User',
    })
  }

  const handleInvite = (): void => {
    openDrawer({
      content: (
        <Form<InviteUserFormData>
          onSubmit={async (data): Promise<void> => {
            await inviteUser.mutateAsync({
              email: data.email,
              role: data.role as OrganizationRole,
              projects: data.projects,
            })
            closeDrawer()
            toast.success('Invitation sent successfully')
          }}
          onCancel={closeDrawer}
          schema={inviteUserSchema}
          defaultValues={{
            role: 'member',
          }}
        >
          {(control): JSX.Element => (
            <Stack spacing={2}>
              <FormTextField control={control} name="firstName" label="First Name" placeholder="John" fullWidth />
              <FormTextField control={control} name="lastName" label="Last Name" placeholder="Doe" fullWidth />
              <FormTextField control={control} name="email" label="Email" placeholder="user@example.com" fullWidth />

              <FormSelect
                control={control}
                name="role"
                label="Role"
                options={[
                  { value: 'owner', label: 'Owner' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'member', label: 'Member' },
                ]}
                fullWidth
              />

              <FormCheckboxGroup
                control={control}
                name="projects"
                label="Projects Access"
                options={
                  projects?.map((project) => ({
                    value: project._id,
                    label: project.name,
                  })) ?? []
                }
              />
            </Stack>
          )}
        </Form>
      ),
      title: 'Invite User',
    })
  }

  const columns: GridColDef[] = [
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'organizationRole',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'owner' ? 'error' : params.value === 'admin' ? 'warning' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color={params.value === 'active' ? 'success' : 'warning'} size="small" />
      ),
    },
    {
      field: 'projects',
      headerName: 'Projects',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          {params.value.map((project: Project) => (
            <Chip key={project._id} label={project.name} size="small" sx={{ mr: 0.5 }} />
          ))}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params): JSX.Element => {
        const userStatus = params.row.status

        return (
          <Box display="flex" height="100%" alignItems="center" gap={1}>
            <IconButton size="small" title="Update user" onClick={(): void => handleEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>

            {userStatus === 'pending' ? (
              <IconButton
                size="small"
                onClick={(): Promise<void> => handleResendInvitation(params.row._id)}
                color="primary"
                disabled={resendInvitation.isPending}
                title="Resend invitation"
              >
                <EmailIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton
                size="small"
                onClick={(): void => setUserToDelete({ id: params.row._id, email: params.row.email })}
                disabled={userStatus === 'inactive'}
                title={userStatus === 'inactive' ? 'User already inactive' : 'Remove user'}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        )
      },
    },
  ]

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
          Users
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleInvite}>
          Invite User
        </Button>
      </Box>

      <Stack spacing={2}>
        {!users?.length ? (
          <Alert severity="info">No users found. Invite your first team member to get started.</Alert>
        ) : (
          <DataGrid
            rows={users}
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
        open={!!userToDelete}
        onClose={(): void => setUserToDelete(null)}
        onConfirm={async (): Promise<void> => {
          if (userToDelete) {
            await deleteUser.mutateAsync(userToDelete.id)
            setUserToDelete(null)
            toast.success('User removed from organization')
          }
        }}
        title="Remove User"
        description={`Are you sure you want to remove "${userToDelete?.email}" from this organization?`}
        isLoading={deleteUser.isPending}
      />
    </Box>
  )
}

export default Users
