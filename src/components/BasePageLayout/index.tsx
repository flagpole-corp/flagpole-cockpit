import { Box, Stack } from '@mui/material'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { AppNavbar, Header, SideMenu } from '~/components'

interface DashboardLayoutProps {
  children?: ReactNode
  title?: string
}

export const BasePageLayout = ({ title }: DashboardLayoutProps): JSX.Element => {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      <AppNavbar />
      <Box
        component="main"
        sx={(): object => ({
          flexGrow: 1,
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
          <Header title={title} />
          <Outlet />
        </Stack>
      </Box>
    </Box>
  )
}
