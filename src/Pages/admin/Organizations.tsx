import { useQuery } from '@tanstack/react-query'
import type { GridColDef } from '@mui/x-data-grid'
import { DataGrid } from '@mui/x-data-grid'
import { Box, Chip, Typography } from '@mui/material'
import { formatDistanceToNow } from 'date-fns'
import api from '~/lib/axios'

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Organization', flex: 1 },
  { field: 'ownerEmail', headerName: 'Owner Email', flex: 1 },
  {
    field: 'plan',
    headerName: 'Plan',
    width: 130,
    renderCell: (params) => (
      <Chip label={params.value} color={params.value === 'TRIAL' ? 'warning' : 'primary'} size="small" />
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    flex: 1,
    renderCell: (params) => formatDistanceToNow(new Date(params.value), { addSuffix: true }),
  },
  {
    field: 'trialEndsAt',
    headerName: 'Trial Ends',
    flex: 1,
    renderCell: (params) => (params.value ? formatDistanceToNow(new Date(params.value), { addSuffix: true }) : '-'),
  },
]

export const OrganizationsPage = (): JSX.Element => {
  const { data: organizations, isLoading } = useQuery({
    queryKey: ['admin', 'organizations'],
    queryFn: async () => {
      const response = await api.get('/api/admin/organizations')
      return response.data
    },
  })

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Organizations
      </Typography>

      <DataGrid rows={organizations ?? []} columns={columns} loading={isLoading} getRowId={(row): string => row._id} />
    </Box>
  )
}
