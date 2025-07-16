import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded'
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded'
import { NavLink, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { styled, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material'

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
      color: theme.palette.common.white,
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
  { text: 'Projects', icon: <AssignmentRoundedIcon />, url: '/projects' },
  { text: 'Flags', icon: <ToggleOnOutlinedIcon />, url: '/flags' },
  { text: 'Users', icon: <PeopleRoundedIcon />, url: '/users' },
]

const secondaryListItems: ListItemsType[] = []

const MenuItem = ({ item }: { item: ListItemsType }): JSX.Element => {
  const location = useLocation()
  const isActive = location.pathname === item.url

  return (
    <ListItem disablePadding sx={{ display: 'block' }}>
      <StyledNavLink to={item.url} sx={{ color: isActive ? 'red' : 'inherit' }}>
        <StyledListItemButton selected={isActive}>
          <ListItemIcon
            sx={{
              minWidth: 40,
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
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
        // height: '100%',
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
