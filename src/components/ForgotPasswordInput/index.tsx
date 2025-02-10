import { z } from 'zod'
import { Button } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { FormTextField } from '~/components/FormTextField'
import { useForgotPassword } from '~/lib/queries/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordProps {
  open: boolean
  handleClose: () => void
}

export const ForgotPasswordInput = ({ open, handleClose }: ForgotPasswordProps): JSX.Element => {
  const forgotPassword = useForgotPassword()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData): Promise<void> => {
    try {
      await forgotPassword.mutateAsync({
        email: data.email,
      })
      reset()
      handleClose()
    } catch (error) {
      console.error('Failed to send reset password email:', error)
    }
  }

  const handleCancel = (): void => {
    reset()
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { backgroundImage: 'none' },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', pt: 2 }}>
        <DialogContentText>
          Enter your account's email address, and we'll send you a link to reset your password.
        </DialogContentText>

        <FormTextField control={control} name="email" label="Email address" autoFocus fullWidth autoComplete="email" />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
