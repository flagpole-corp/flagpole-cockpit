import type { GridColDef } from '@mui/x-data-grid'
import { UserActionsCell } from '../components/UserActionsCell'
import { ProjectsCell } from '../components/ProjectsCell'
import { RoleCell } from '../components/RoleCell'
import { StatusCell } from '../components/StatusCell'
import type { BackendUser, UserToDelete } from '../types'

interface UseUsersTableColumnsProps {
  onEdit: (user: BackendUser) => void
  onDelete: (user: UserToDelete) => void
  onResendInvitation: (userId: string) => Promise<void>
  isResendingInvitation: boolean
}

export const useUsersTableColumns = ({
  onEdit,
  onDelete,
  onResendInvitation,
  isResendingInvitation,
}: UseUsersTableColumnsProps): GridColDef<BackendUser>[] => {
  return [
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'name',
      headerName: 'Name',
      renderCell: (params): JSX.Element => {
        return (
          <>
            {params.row.firstName} {params.row.lastName}
          </>
        )
      },
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'organizationRole',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => <RoleCell role={params.value} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusCell status={params.value} />,
    },
    {
      field: 'projects',
      headerName: 'Projects',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <ProjectsCell projects={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <UserActionsCell
          user={params.row}
          onEdit={onEdit}
          onDelete={onDelete}
          onResendInvitation={onResendInvitation}
          isResendingInvitation={isResendingInvitation}
        />
      ),
    },
  ]
}
