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
import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

type ListItemsType = {
  text: string
  icon: ReactNode
  url: `/${string}`
}
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

export const MenuContent = (): JSX.Element => {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem
            color="green"
            component={NavLink}
            to={item.url}
            key={index}
            disablePadding
            sx={{ display: 'block' }}
          >
            <ListItemButton color="yellow" selected={index === 0}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText color="red" primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding component={NavLink} to={item.url} sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  )
}
