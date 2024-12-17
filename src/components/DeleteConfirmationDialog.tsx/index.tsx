import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'

interface DeleteConfirmationDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  isLoading?: boolean
}

export const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
}: DeleteConfirmationDialogProps): JSX.Element => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button startIcon={<DeleteIcon />} onClick={onConfirm} variant="outlined" color="error" disabled={isLoading}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
