import { Chip } from '@mui/material'
import type { ChipProps } from '@mui/material/Chip'
import type { BackendInviteUserDto } from '../types'

interface RoleCellProps {
  role: BackendInviteUserDto['role']
}

export const RoleCell = ({ role }: RoleCellProps): JSX.Element => {
  const getColorByRole = (role: BackendInviteUserDto['role']): ChipProps['color'] => {
    switch (role) {
      case 'owner':
        return 'error'
      case 'admin':
        return 'warning'
      case 'member':
        return 'default'
      default:
        return 'default'
    }
  }

  return <Chip label={role} color={getColorByRole(role)} size="small" />
}
