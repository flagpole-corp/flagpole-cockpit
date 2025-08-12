import { Stack } from '@mui/material'
import type { Control } from 'react-hook-form'
import { FormTextField } from '~/components/FormTextField'
import { FormSelect } from '~/components/FormSelect'
import { FormCheckboxGroup } from '~/components/FormCheckboxGroup'
import type { Project } from '~/lib/queries/projects'
import type { InviteUserFormData, BackendInviteUserDto } from './types'

interface InviteUserFormProps {
  control: Control<InviteUserFormData>
  projects: Project[]
}

export const InviteUserForm = ({ control, projects }: InviteUserFormProps): JSX.Element => {
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
      <FormTextField control={control} name="firstName" label="First Name" placeholder="John" fullWidth />
      <FormTextField control={control} name="lastName" label="Last Name" placeholder="Doe" fullWidth />
      <FormTextField control={control} name="email" label="Email" placeholder="user@example.com" fullWidth />
      <FormSelect control={control} name="role" label="Role" options={roleOptions} fullWidth />
      <FormCheckboxGroup control={control} name="projects" label="Projects Access" options={projectOptions} />
    </Stack>
  )
}
