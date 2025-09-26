import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './routes'
import { queryClient } from './lib/queryClient'
import { ProjectProvider } from './contexts/ProjectContext'
import { ModalProvider } from './contexts/ModalContext'
import { DrawerProvider } from './contexts/DrawerContext'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ModalProvider>
          <DrawerProvider>
            <ProjectProvider>
              <AppRouter />
            </ProjectProvider>
          </DrawerProvider>
        </ModalProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  )
}

export default App
