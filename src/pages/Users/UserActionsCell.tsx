import { Box, IconButton } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import type { BackendUser, UserToDelete } from './types'

interface UserActionsCellProps {
  user: BackendUser
  onEdit: (user: BackendUser) => void
  onDelete: (user: UserToDelete) => void
  onResendInvitation: (userId: string) => Promise<void>
  isResendingInvitation: boolean
}

export const UserActionsCell = ({
  user,
  onEdit,
  onDelete,
  onResendInvitation,
  isResendingInvitation,
}: UserActionsCellProps): JSX.Element => {
  const userStatus = user.status

  const handleEdit = (): void => {
    onEdit(user)
  }

  const handleDelete = (): void => {
    onDelete({ id: user._id, email: user.email })
  }

  const handleResendInvitation = (): Promise<void> => {
    return onResendInvitation(user._id)
  }

  return (
    <Box display="flex" height="100%" alignItems="center" gap={1}>
      <IconButton size="small" title="Update user" onClick={handleEdit}>
        <EditIcon fontSize="small" />
      </IconButton>

      {userStatus === 'pending' ? (
        <IconButton
          size="small"
          onClick={handleResendInvitation}
          color="primary"
          disabled={isResendingInvitation}
          title="Resend invitation"
        >
          <EmailIcon fontSize="small" />
        </IconButton>
      ) : (
        <IconButton
          size="small"
          onClick={handleDelete}
          disabled={userStatus === 'inactive'}
          title={userStatus === 'inactive' ? 'User already inactive' : 'Remove user'}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  )
}
