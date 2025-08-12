import { Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

interface UsersPageHeaderProps {
  onInviteUser: () => void
}

export const UsersPageHeader = ({ onInviteUser }: UsersPageHeaderProps): JSX.Element => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h5" component="h1">
        Users
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onInviteUser}>
        Invite User
      </Button>
    </Box>
  )
}
