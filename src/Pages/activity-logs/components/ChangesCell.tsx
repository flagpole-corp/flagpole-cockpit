import { Box, Typography, Chip } from '@mui/material'

interface ChangesCellProps {
  metadata?: {
    changes?: Array<{
      field: string
      oldValue: any
      newValue: any
    }>
    description?: string
  }
}

export const ChangesCell = ({ metadata }: ChangesCellProps): JSX.Element => {
  if (!metadata) {
    return (
      <Typography variant="body2" color="text.secondary">
        -
      </Typography>
    )
  }

  // If there's a description, show that
  if (metadata.description) {
    return <Typography variant="body2">{metadata.description}</Typography>
  }

  // Otherwise show individual changes
  if (metadata.changes?.length) {
    return (
      <Box>
        {metadata.changes.map((change, index) => (
          <Chip
            key={index}
            label={`${change.field}: ${change.oldValue} → ${change.newValue}`}
            size="small"
            sx={{ mr: 0.5, mb: 0.5 }}
          />
        ))}
      </Box>
    )
  }

  return (
    <Typography variant="body2" color="text.secondary">
      -
    </Typography>
  )
}
