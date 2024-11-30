import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './routes'
import { AuthProvider } from './contexts/AuthContext'
import { queryClient } from './lib/queryClient'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { ProjectProvider } from './contexts/ProjectContext'

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProjectProvider>
          <AppRouter />
        </ProjectProvider>
      </AuthProvider>
      <ToastContainer />
    </QueryClientProvider>
  )
}

export default App
