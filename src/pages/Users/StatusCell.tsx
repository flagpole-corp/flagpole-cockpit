import { Chip } from '@mui/material'
import type { ChipProps } from '@mui/material/Chip'

interface StatusCellProps {
  status: string
}

export const StatusCell = ({ status }: StatusCellProps): JSX.Element => {
  const getColorByStatus = (status: string): ChipProps['color'] => {
    return status === 'active' ? 'success' : 'warning'
  }

  return <Chip label={status} color={getColorByStatus(status)} size="small" />
}
