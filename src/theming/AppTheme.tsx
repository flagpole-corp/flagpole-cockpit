import { ThemeProvider, createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'
import { inputsCustomizations } from './customizations/inputs'
import { dataDisplayCustomizations } from './customizations/dataDisplay'
import { feedbackCustomizations } from './customizations/feedback'
import { navigationCustomizations } from './customizations/navigation'
import { surfacesCustomizations } from './customizations/surfaces'
import { colorSchemes, typography, shadows, shape } from './themePrimitives'
import { ReactNode, useMemo } from 'react'

interface AppThemeProps {
  children: ReactNode
  disableCustomTheme?: boolean
  themeComponents?: ThemeOptions['components']
}

export const AppTheme = ({ children, themeComponents }: AppThemeProps): JSX.Element => {
  const theme = useMemo(() => {
    return createTheme({
      cssVariables: {
        colorSchemeSelector: 'data-mui-color-scheme',
        cssVarPrefix: 'template',
      },
      colorSchemes,
      typography,
      shadows,
      shape,
      components: {
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
        ...themeComponents,
      },
    })
  }, [themeComponents])

  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      {children}
    </ThemeProvider>
  )
}
