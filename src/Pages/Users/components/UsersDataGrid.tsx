import { Stack, Alert } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef } from '@mui/x-data-grid'
import type { BackendUser } from '../types'

interface UsersDataGridProps {
  users: BackendUser[] | undefined
  columns: GridColDef<BackendUser>[]
  isLoading: boolean
}

export const UsersDataGrid = ({ users, columns, isLoading }: UsersDataGridProps): JSX.Element => {
  if (!users?.length && !isLoading) {
    return <Alert severity="info">No users found. Invite your first team member to get started.</Alert>
  }

  return (
    <Stack spacing={2}>
      <DataGrid<BackendUser>
        rows={users || []}
        columns={columns}
        disableColumnMenu
        disableRowSelectionOnClick
        getRowId={(row): string => row._id}
        loading={isLoading}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
      />
    </Stack>
  )
}
