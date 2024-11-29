import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './routes'
import { AuthProvider } from './contexts/AuthContext'
import { queryClient } from './lib/queryClient'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
      <ToastContainer />
    </QueryClientProvider>
  )
}

export default App
