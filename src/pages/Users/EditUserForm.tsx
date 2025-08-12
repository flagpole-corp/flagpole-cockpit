import { Stack } from '@mui/material'
import type { Control } from 'react-hook-form'
import { FormTextField } from '~/components/FormTextField'
import { FormSelect } from '~/components/FormSelect'
import { FormCheckboxGroup } from '~/components/FormCheckboxGroup'
import type { Project } from '~/lib/queries/projects'
import type { EditUserFormData, BackendInviteUserDto } from './types'

interface EditUserFormProps {
  control: Control<EditUserFormData>
  projects: Project[]
}

export const EditUserForm = ({ control, projects }: EditUserFormProps): JSX.Element => {
  const roleOptions: Array<{ value: NonNullable<BackendInviteUserDto['role']>; label: string }> = [
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' },
  ]

  const projectOptions = projects.map((project) => ({
    value: project._id,
    label: project.name,
  }))

  return (
    <Stack spacing={2}>
      <FormTextField control={control} name="email" label="Email" disabled fullWidth />
      <FormSelect control={control} name="role" label="Role" options={roleOptions} fullWidth />
      <FormCheckboxGroup control={control} name="projects" label="Projects Access" options={projectOptions} />
    </Stack>
  )
}
