import { styled } from '@mui/material/styles'
import {
  Divider,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemText,
  ListItemIcon,
  dividerClasses,
  paperClasses,
  listClasses,
  listItemIconClasses,
  Stack,
  Typography,
} from '@mui/material'
import {
  MoreVertRounded,
  LogoutRounded,
  Person,
  Receipt,
  RocketLaunch,
  LibraryBooks,
  HelpRounded,
  OpenInNew,
} from '@mui/icons-material'
import { MenuButton } from '../MenuButton'
import { useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '~/stores/auth.store'

const MenuItem = styled(MuiMenuItem)({ margin: '2px 0' })

const menuItemIconStyle = {
  [`& .${listItemIconClasses.root}`]: {
    ml: 'auto',
    minWidth: 0,
  },
}

const menuStyles = {
  [`& .${listClasses.root}`]: { padding: '4px' },
  [`& .${paperClasses.root}`]: {
    minWidth: 180,
    padding: 0,
  },
  [`& .${dividerClasses.root}`]: { margin: '4px -4px' },
}

export const OptionsMenu = (): JSX.Element => {
  const { logout } = useAuthStore()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const menuItems = [
    { text: 'Profile', icon: <Person />, onClick: () => navigate('/profile') },
    { text: 'Billing', icon: <Receipt />, onClick: () => navigate('/profile/billing') },
    null, // Divider
    { text: 'Onboarding', icon: <RocketLaunch />, onClick: () => navigate('/onboarding') },
    {
      text: 'Feedback',
      icon: <HelpRounded />,
      onClick: () => navigate('/feedback'),
    },
    {
      text: (
        <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
          <Typography>Docs</Typography> <OpenInNew sx={{ fontSize: 15, pt: '1px' }} />{' '}
        </Stack>
      ),
      icon: <LibraryBooks />,
      onClick: () => window.open('https://docs.useflagpole.dev', '_blank', 'noopener,noreferrer'),
    },
    null, // Divider
    { text: 'Logout', icon: <LogoutRounded fontSize="small" />, onClick: logout },
  ]

  return (
    <Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={(e): void => setAnchorEl(e.currentTarget)}
        sx={{ borderColor: 'transparent' }}
      >
        <MoreVertRounded />
      </MenuButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={(): void => setAnchorEl(null)}
        onClick={(): void => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={menuStyles}
      >
        {menuItems.map((item, index) =>
          item ? (
            <MenuItem key={String(item.text)} onClick={item.onClick} sx={menuItemIconStyle}>
              <ListItemText>{item.text}</ListItemText>
              <ListItemIcon>{item.icon}</ListItemIcon>
            </MenuItem>
          ) : (
            <Divider key={`divider-${index}`} />
          )
        )}
      </Menu>
    </Fragment>
  )
}
