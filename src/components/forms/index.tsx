import type { ReactNode } from 'react'
import type { UseFormProps, FieldValues, Control, DefaultValues } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, Stack } from '@mui/material'
import type { ZodSchema } from 'zod'

interface FormProps<TFormData extends FieldValues> {
  onSubmit: (data: TFormData) => void | Promise<void>
  onCancel: (reset: (defaultValues?: DefaultValues<TFormData>) => void) => void
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
    reset,
  } = useForm<TFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const handleFormSubmit = async (data: TFormData): Promise<void> => {
    try {
      await onSubmit(data)
      reset(defaultValues as DefaultValues<TFormData>)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={(e): void => {
        e.preventDefault()
        handleSubmit(handleFormSubmit)(e)
      }}
      noValidate
      autoComplete="off"
    >
      <Stack spacing={3}>
        {children(control)}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={(): void => onCancel(reset)}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}

export * from './FormSelect'
export * from './FormTextField'
export * from './FormCheckboxGroup'
export * from './ConditionForms'
export * from './FeatureFlagConditions'
