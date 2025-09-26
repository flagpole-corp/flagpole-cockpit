import { useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'
import { useUsers, useDeleteUser } from '~/lib/queries/users'
import { DeleteConfirmationDialog } from '~/components/modals/DeleteConfirmationDialog'
import { UsersPageHeader } from './UsersPageHeader'
import { UsersDataGrid } from './UsersDataGrid'
import { useUserActions } from './hooks/useUserActions'
import { useUsersTableColumns } from './hooks/useUsersTableColumns'
import type { UserToDelete } from './types'

const Users = (): JSX.Element => {
  const [userToDelete, setUserToDelete] = useState<UserToDelete | null>(null)

  const { data: users, isLoading } = useUsers()
  const deleteUser = useDeleteUser()

  const { handleInvite, handleEdit, handleResendInvitation, isResendingInvitation } = useUserActions()

  const columns = useUsersTableColumns({
    onEdit: handleEdit,
    onDelete: setUserToDelete,
    onResendInvitation: handleResendInvitation,
    isResendingInvitation,
  })

  const handleConfirmDelete = async (): Promise<void> => {
    if (userToDelete) {
      await deleteUser.mutateAsync(userToDelete.id)
      setUserToDelete(null)
      toast.success('User removed from organization')
    }
  }

  const handleCloseDeleteDialog = (): void => {
    setUserToDelete(null)
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
      <UsersPageHeader onInviteUser={handleInvite} />

      <UsersDataGrid users={users} columns={columns} isLoading={isLoading} />

      <DeleteConfirmationDialog
        open={!!userToDelete}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Remove User"
        description={`Are you sure you want to remove "${userToDelete?.email}" from this organization?`}
        isLoading={deleteUser.isPending}
      />
    </Box>
  )
}

export default Users
