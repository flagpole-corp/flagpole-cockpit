import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { AppNavbar, Header, MainGrid, SideMenu } from '~/components'

export const Dashboard = (): JSX.Element => {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      <AppNavbar />
      <Box
        component="main"
        sx={(): object => ({
          flexGrow: 1,
          // backgroundColor: theme.vars
          //   ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
          //   : alpha(theme.palette.background.default, 1),
          overflow: 'auto',
        })}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Header />
          <MainGrid />
        </Stack>
      </Box>
    </Box>
  )
}
