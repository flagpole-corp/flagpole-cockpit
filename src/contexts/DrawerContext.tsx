// src/contexts/DrawerContext.tsx
import type { ReactNode } from 'react'
import { createContext, useContext, useState, useCallback } from 'react'
import { Drawer, Box } from '@mui/material'

interface DrawerContextType {
  openDrawer: (content: ReactNode) => void
  closeDrawer: () => void
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

export const DrawerProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  const [drawerContent, setDrawerContent] = useState<ReactNode | null>(null)

  const openDrawer = useCallback((content: ReactNode): void => {
    setDrawerContent(content)

    setIsOpen(true)
  }, [])

  const closeDrawer = useCallback((): void => {
    setIsOpen(false)
    setDrawerContent(null)
  }, [])

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      <Drawer anchor="right" open={isOpen} onClose={closeDrawer}>
        <Box sx={{ width: 400, p: 3 }}>{drawerContent}</Box>
      </Drawer>
    </DrawerContext.Provider>
  )
}

export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext)
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider')
  }
  return context
}
