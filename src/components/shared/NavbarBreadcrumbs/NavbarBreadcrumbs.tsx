import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import { DASHBOARD_ROUTES } from '~/routes/dashboard'
import { APP_ROUTES } from '~/routes'
import type { NonIndexRouteConfig } from '~/routes/config'

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: theme.palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}))

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
}))

interface BreadcrumbItem {
  title: string
  path: string
  isLast: boolean
}

const getAllRoutes = (): NonIndexRouteConfig[] => [
  {
    path: '/dashboard',
    title: 'Dashboard',
  },
  ...DASHBOARD_ROUTES,
]

const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  const allRoutes = getAllRoutes()
  const paths = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []
  let currentPath = ''

  const isDashboardRoute = paths.length > 0 && paths[0] !== 'signin' && paths[0] !== 'signup'
  if (isDashboardRoute) {
    const dashboardRoute = allRoutes.find((route) => route.path === '/dashboard')
    if (dashboardRoute) {
      items.push({
        title: dashboardRoute.title || 'Overview',
        path: dashboardRoute.path,
        isLast: paths.length === 0,
      })
    }
  }

  paths.forEach((path, index) => {
    currentPath += `/${path}`
    const route = allRoutes.find((r) => r.path === currentPath)
    if (route?.title) {
      items.push({
        title: route.title,
        path: currentPath,
        isLast: index === paths.length - 1,
      })
    }
  })

  return items
}

export const NavbarBreadcrumbs = (): JSX.Element => {
  const location = useLocation()
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])

  useEffect(() => {
    const items = getBreadcrumbItems(location.pathname)
    setBreadcrumbs(items)
  }, [location])

  if (
    location.pathname === APP_ROUTES.SIGNIN.path ||
    location.pathname === APP_ROUTES.SIGNUP.path ||
    breadcrumbs.length <= 1
  ) {
    return <></>
  }

  return (
    <StyledBreadcrumbs aria-label="breadcrumb" separator={<NavigateNextRoundedIcon fontSize="small" />}>
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1

        return isLast ? (
          <Typography key={item.path} variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
            {item.title}
          </Typography>
        ) : (
          <StyledLink key={item.path} to={item.path}>
            <Typography variant="body1">{item.title}</Typography>
          </StyledLink>
        )
      })}
    </StyledBreadcrumbs>
  )
}
