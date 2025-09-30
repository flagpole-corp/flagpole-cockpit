// ~/pages/activity-logs/hooks/useActivityLogsTableColumns.tsx
import type { GridColDef } from '@mui/x-data-grid'
import { UserCell } from '../components/UserCell'
import { ActionCell } from '../components/ActionCell'
import { ChangesCell } from '../components/ChangesCell'
import type { ActivityLog } from '~/lib/api/activity-logs/types'

export const useActivityLogsTableColumns = (): GridColDef<ActivityLog>[] => {
  return [
    {
      field: 'createdAt',
      headerName: 'Time',
      width: 180,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString()
      },
    },
    {
      field: 'actor',
      headerName: 'User',
      width: 200,
      renderCell: (params) => (
        <UserCell actor={params.row.actor} actorName={params.row.actorName} actorEmail={params.row.actorEmail} />
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => <ActionCell action={params.row.action} entityType={params.row.entityType} />,
    },
    {
      field: 'entityName',
      headerName: 'Entity',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'project',
      headerName: 'Project',
      width: 150,
      valueFormatter: (params) => params.value || '-',
    },
    {
      field: 'metadata',
      headerName: 'Changes',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => <ChangesCell metadata={params.value} />,
    },
  ]
}
