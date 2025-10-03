import type { ReactNode } from 'react'
import { createContext, useContext, useState, useCallback } from 'react'
import { Drawer, Box, Stack, Typography } from '@mui/material'

type DrawerSizes = 'small' | 'medium' | 'large' | 'fullWidth'

interface DrawerOptions {
  content: ReactNode
  size?: DrawerSizes
  title?: string
  or?: string
}

interface DrawerContextType {
  openDrawer: (options: DrawerOptions) => void
  closeDrawer: () => void
}

const DRAWER_SIZES: Record<DrawerSizes, string | number> = {
  small: 300,
  medium: 500,
  large: 700,
  fullWidth: '100%',
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined)

export const DrawerProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false)
  const [drawerContent, setDrawerContent] = useState<ReactNode | null>(null)
  const [size, setSize] = useState<DrawerSizes>('medium')
  const [drawerTitle, setDrawerTitle] = useState<string | undefined>(undefined)

  const openDrawer = useCallback(({ content, size = 'medium', title }: DrawerOptions): void => {
    setDrawerContent(content)
    setSize(size)
    setIsOpen(true)
    setDrawerTitle(title)
  }, [])

  const closeDrawer = useCallback((): void => {
    setIsOpen(false)
    setDrawerContent(null)
  }, [])

  return (
    <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
      {children}
      <Drawer anchor="right" open={isOpen} onClose={closeDrawer}>
        <Box
          sx={{
            p: 3,
            width: DRAWER_SIZES[size],
            maxWidth: size === 'fullWidth' ? '100%' : '80vw',
          }}
        >
          <Stack spacing={2} direction={'column'}>
            <Typography variant="h5">{drawerTitle}</Typography>
            {drawerContent}
          </Stack>
        </Box>
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
