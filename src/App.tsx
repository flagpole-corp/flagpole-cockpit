import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './routes'
import { AuthProvider } from './contexts/AuthContext'
import { queryClient } from './lib/queryClient'
import { ProjectProvider } from './contexts/ProjectContext'
import { SnackbarProvider } from './contexts/SnackbarContext'

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <AuthProvider>
          <ProjectProvider>
            <AppRouter />
          </ProjectProvider>
        </AuthProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  )
}

export default App
