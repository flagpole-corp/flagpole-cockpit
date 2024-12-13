// src/components/Form/FormTextField.tsx
import type { Control, FieldValues, Path } from 'react-hook-form'
import { useController } from 'react-hook-form'
import type { TextFieldProps } from '@mui/material'
import { TextField } from '@mui/material'

interface FormTextFieldProps<T extends FieldValues> extends Omit<TextFieldProps, 'name'> {
  control: Control<T>
  name: Path<T>
}

export function FormTextField<T extends FieldValues>({ control, name, ...props }: FormTextFieldProps<T>): JSX.Element {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control })

  return <TextField size="medium" {...field} {...props} error={!!error} helperText={error?.message} />
}
