import Stack from '@mui/material/Stack'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import { NavbarBreadcrumbs } from '../../shared/NavbarBreadcrumbs/NavbarBreadcrumbs'
import { MenuButton } from '../../shared/MenuButton/MenuButton'
import ColorModeIconDropdown from '../../../theming/ColorModeIconDropdown'

import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

type HeaderProps = {
  title?: string
}

export const Header = ({ title }: HeaderProps): JSX.Element => {
  const navigate = useNavigate()

  return (
    <>
      <Stack
        direction="row"
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '100%',
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          maxWidth: { sm: '100%', md: '1700px' },
          pt: 1.5,
        }}
        spacing={2}
      >
        <NavbarBreadcrumbs />
        <Stack direction="row" sx={{ gap: 1 }}>
          <MenuButton onClick={(): void => navigate('/activity-logs')} showBadge aria-label="Open notifications">
            <NotificationsRoundedIcon />
          </MenuButton>
          <ColorModeIconDropdown />
        </Stack>
      </Stack>
      <Typography component="h2" variant="h6" sx={{ mb: 2, '&&&': { mr: 'auto' } }}>
        {title}
      </Typography>
    </>
  )
}
