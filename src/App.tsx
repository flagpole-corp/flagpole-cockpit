import { QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './routes'
import { queryClient } from './lib/queryClient'
import { ProjectProvider } from './contexts/ProjectContext'
import { ModalProvider } from './contexts/ModalContext'
import { DrawerProvider } from './contexts/DrawerContext'

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <DrawerProvider>
          <ProjectProvider>
            <AppRouter />
          </ProjectProvider>
        </DrawerProvider>
      </ModalProvider>
    </QueryClientProvider>
  )
}

export default App
