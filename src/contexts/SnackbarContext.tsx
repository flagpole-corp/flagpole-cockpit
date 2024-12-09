import type { SyntheticEvent, ReactNode } from 'react'
import { createContext, useContext, useState, useCallback } from 'react'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import type { AlertColor } from '@mui/material'

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertColor) => void
}

const SnackbarContext = createContext<SnackbarContextType | null>(null)

export const SnackbarProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AlertColor>('success')

  const handleClose = (_?: SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }

  const showSnackbar = useCallback((message: string, severity: AlertColor = 'success') => {
    setMessage(message)
    setSeverity(severity)
    setOpen(true)
  }, [])

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext)
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider')
  }
  return context
}
