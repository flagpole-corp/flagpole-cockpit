import Stack from '@mui/material/Stack'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import { CustomDatePicker } from '../CustomDatePicker'
import { NavbarBreadcrumbs } from '../NavbarBreadcrumbs'
import { MenuButton } from '../MenuButton'
import ColorModeIconDropdown from '../../theming/ColorModeIconDropdown'

import { Search } from '../Search'
import { Typography } from '@mui/material'

type HeaderProps = {
  title?: string
}

export const Header = ({ title }: HeaderProps): JSX.Element => {
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
          <Search />
          <CustomDatePicker />
          <MenuButton showBadge aria-label="Open notifications">
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
