import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Reset.css'
import App from './App'
import CssBaseline from '@mui/material/CssBaseline'
import AppTheme from './theming/AppTheme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppTheme>
      <CssBaseline enableColorScheme />
      <App />
    </AppTheme>
  </StrictMode>
)
