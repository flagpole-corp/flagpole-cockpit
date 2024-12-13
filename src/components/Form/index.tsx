import type { ReactNode } from 'react'
import type { UseFormProps, FieldValues, Control } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Stack } from '@mui/material'
import type { ZodSchema } from 'zod'

interface FormProps<TFormData extends FieldValues> {
  onSubmit: (data: TFormData) => void | Promise<void>
  onCancel: () => void
  schema: ZodSchema
  defaultValues?: UseFormProps<TFormData>['defaultValues']
  children: (control: Control<TFormData>) => ReactNode
}

export function Form<TFormData extends FieldValues>({
  onSubmit,
  onCancel,
  schema,
  defaultValues,
  children,
}: FormProps<TFormData>): JSX.Element {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<TFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
      <Stack spacing={3}>
        {typeof children === 'function' ? children(control) : children}

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
