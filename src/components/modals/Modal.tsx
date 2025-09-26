import type { ReactNode } from 'react'
import { Dialog, DialogTitle, DialogContent, Typography, Box } from '@mui/material'

interface ModalProps<TSubmitData> {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  actions?: ReactNode
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  onSubmit?: (data: TSubmitData) => void | Promise<void>
  submitText?: string
  isSubmitting?: boolean
}

export function Modal<TSubmitData = unknown>({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'sm',
}: ModalProps<TSubmitData>): JSX.Element {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle>
        {title}
        {subtitle && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            {subtitle}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>{children}</Box>
      </DialogContent>
    </Dialog>
  )
}
