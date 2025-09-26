import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './routes'
import { queryClient } from './lib/queryClient'
import { DrawerProvider, ModalProvider, ProjectProvider } from './contexts'
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
