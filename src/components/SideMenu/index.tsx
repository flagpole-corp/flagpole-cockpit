import { styled, Avatar, Drawer as MuiDrawer, drawerClasses, Box, Typography, Stack } from '@mui/material'
import { MenuContent } from '../MenuContent'
import { OptionsMenu } from '../OptionsMenu'
import { Logo } from '~/components'
import { useAuthStore } from '~/stores/auth.store'
import RenewPlanCard from '../RenewPlanCard'

const drawerWidth = 240

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
})

export const SideMenu = (): JSX.Element => {
  const { user } = useAuthStore()
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Logo />
      </Box>
      <MenuContent />
      <RenewPlanCard />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={`${user?.firstName} ${user?.lastName}`}
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {user?.email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  )
}
