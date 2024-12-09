import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import InfoRoundedIcon from '@mui/icons-material/InfoRounded'
import HelpRoundedIcon from '@mui/icons-material/HelpRounded'
import { NavLink, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { styled } from '@mui/material/styles'

type ListItemsType = {
  text: string
  icon: ReactNode
  url: `/${string}`
}

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: 'inherit',
  display: 'block',
  width: '100%',
  '&.active .MuiListItemButton-root': {
    backgroundColor: theme.palette.action.selected,
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
    '& .MuiListItemText-primary': {
      color: theme.palette.primary.main,
      fontWeight: 600,
    },
  },
}))

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: '4px 8px',
  width: 'auto',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}))

const mainListItems: ListItemsType[] = [
  { text: 'Home', icon: <HomeRoundedIcon />, url: '/dashboard' },
  { text: 'Flags', icon: <ToggleOnOutlinedIcon />, url: '/flags' },
  { text: 'Clients', icon: <PeopleRoundedIcon />, url: '/' },
  { text: 'Tasks', icon: <AssignmentRoundedIcon />, url: '/' },
]

const secondaryListItems: ListItemsType[] = [
  { text: 'Onboarding', icon: <SettingsRoundedIcon />, url: '/admin/onboarding' },
  { text: 'Settings', icon: <SettingsRoundedIcon />, url: '/' },
  { text: 'About', icon: <InfoRoundedIcon />, url: '/' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, url: '/' },
]

const MenuItem = ({ item }: { item: ListItemsType }): JSX.Element => {
  const location = useLocation()
  const isActive = location.pathname === item.url

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <StyledNavLink to={item.url}>
        <StyledListItemButton selected={isActive}>
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: isActive ? 'primary.main' : 'inherit',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: '0.875rem',
              },
            }}
          />
        </StyledListItemButton>
      </StyledNavLink>
    </ListItem>
  )
}

export const MenuContent = (): JSX.Element => {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        p: 1,
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <List>
        {mainListItems.map((item) => (
          <MenuItem key={item.text} item={item} />
        ))}
      </List>

      <List>
        {secondaryListItems.map((item) => (
          <MenuItem key={item.text} item={item} />
        ))}
      </List>
    </Stack>
  )
}
