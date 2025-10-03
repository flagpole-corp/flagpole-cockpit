import { Box, Typography } from '@mui/material'

interface UserCellProps {
  actor: {
    _id: string
    email: string
    firstName?: string
    lastName?: string
  }
  actorName: string
  actorEmail: string
}

export const UserCell = ({ actor, actorName, actorEmail }: UserCellProps): JSX.Element => {
  const displayName =
    actorName || (actor.firstName && actor.lastName ? `${actor.firstName} ${actor.lastName}` : actor.email)

  return (
    <Box>
      <Typography variant="body2" fontWeight="medium">
        {displayName}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {actorEmail}
      </Typography>
    </Box>
  )
}
