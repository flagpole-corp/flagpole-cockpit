import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './Reset.css'
import App from './App'
import CssBaseline from '@mui/material/CssBaseline'
import { AppTheme } from './theming/AppTheme'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppTheme>
      <CssBaseline enableColorScheme />
      <ToastContainer position="top-right" autoClose={5000} newestOnTop pauseOnHover />
      <App />
    </AppTheme>
  </StrictMode>
)
