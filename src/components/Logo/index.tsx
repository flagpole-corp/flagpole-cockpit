import { useTheme } from '@mui/material/styles'
import { LogoLight } from './light'
import { LogoDark } from './dark'
export const Logo = (): JSX.Element => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  return isDarkMode ? <LogoLight /> : <LogoDark />
}
