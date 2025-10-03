import { Stack } from '@mui/material'
import type { Control } from 'react-hook-form'
import { FormTextField } from '~/components/forms/FormTextField'
import { FormSelect } from '~/components/forms/FormSelect'
import { FormCheckboxGroup } from '~/components/forms/FormCheckboxGroup'
import { useProjects } from '~/lib/api/projects'
import type { InviteUserFormData, BackendInviteUserDto } from '../types'
import { useWatch } from 'react-hook-form'
import { useEffect } from 'react'

interface InviteUserFormProps {
  control: Control<InviteUserFormData>
}

export const InviteUserForm = ({ control }: InviteUserFormProps): JSX.Element => {
  const { data: projects } = useProjects()
  const selectedRole = useWatch({ control, name: 'role' })

  const roleOptions: Array<{ value: NonNullable<BackendInviteUserDto['role']>; label: string }> = [
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' },
  ]

  const projectOptions =
    projects?.map((project) => ({
      value: project._id,
      label: project.name,
    })) || []

  // Auto-select all projects if admin or owner
  useEffect(() => {
    if ((selectedRole === 'admin' || selectedRole === 'owner') && projects) {
      control._defaultValues.projects = projects.map((p) => p._id)
    }
  }, [selectedRole, projects, control])

  return (
    <Stack spacing={2}>
      <FormTextField control={control} name="firstName" label="First Name" placeholder="John" fullWidth />
      <FormTextField control={control} name="lastName" label="Last Name" placeholder="Doe" fullWidth />
      <FormTextField control={control} name="email" label="Email" placeholder="user@example.com" fullWidth />
      <FormSelect control={control} name="role" label="Role" options={roleOptions} fullWidth />

      {selectedRole === 'member' && (
        <FormCheckboxGroup
          control={control}
          name="projects"
          label="Project Access"
          options={projectOptions}
          helperText="Select which projects this user can access"
        />
      )}

      {(selectedRole === 'admin' || selectedRole === 'owner') && (
        <Stack spacing={1}>
          <FormCheckboxGroup
            control={control}
            name="projects"
            label="Project Access"
            options={projectOptions}
            disabled
            helperText="Admins and Owners have access to all projects"
          />
        </Stack>
      )}
    </Stack>
  )
}
