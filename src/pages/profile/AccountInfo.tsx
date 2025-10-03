import { Avatar, Card, CardActions, CardContent, Divider, Stack, Typography, Chip, Box } from '@mui/material'
import type { User } from '~/lib/api/auth'

interface AccountInfoProps {
  user: User | null
  currentOrgRole: string | undefined
}

export const AccountInfo = ({ user, currentOrgRole }: AccountInfoProps): JSX.Element => {
  const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.[0] || ''
    const last = lastName?.[0] || ''
    return `${first}${last}`.toUpperCase()
  }

  const getFullName = (firstName?: string, lastName?: string): string => {
    return [firstName, lastName].filter(Boolean).join(' ') || 'User'
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar sx={{ height: '80px', width: '80px' }}>{getInitials(user?.firstName, user?.lastName)}</Avatar>
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{getFullName(user?.firstName, user?.lastName)}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <Divider sx={{ my: 1 }} />
      <CardActions>
        {currentOrgRole && (
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
            Role
            <Chip sx={{ ml: 1 }} label={currentOrgRole.toUpperCase()} color="primary" variant="outlined" size="small" />
          </Box>
        )}
      </CardActions>
    </Card>
  )
}
