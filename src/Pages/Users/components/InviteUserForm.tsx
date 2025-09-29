import { Stack } from '@mui/material'
import type { Control } from 'react-hook-form'
import { FormTextField } from '~/components/forms/FormTextField'
import { FormSelect } from '~/components/forms/FormSelect'
import type { InviteUserFormData, BackendInviteUserDto } from '../types'

interface InviteUserFormProps {
  control: Control<InviteUserFormData>
}

export const InviteUserForm = ({ control }: InviteUserFormProps): JSX.Element => {
  const roleOptions: Array<{ value: NonNullable<BackendInviteUserDto['role']>; label: string }> = [
    { value: 'owner', label: 'Owner' },
    { value: 'admin', label: 'Admin' },
    { value: 'member', label: 'Member' },
  ]

  return (
    <Stack spacing={2}>
      <FormTextField control={control} name="firstName" label="First Name" placeholder="John" fullWidth />
      <FormTextField control={control} name="lastName" label="Last Name" placeholder="Doe" fullWidth />
      <FormTextField control={control} name="email" label="Email" placeholder="user@example.com" fullWidth />
      <FormSelect control={control} name="role" label="Role" options={roleOptions} fullWidth />
    </Stack>
  )
}
