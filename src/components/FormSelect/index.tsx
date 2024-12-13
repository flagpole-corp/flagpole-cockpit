// src/components/Form/FormSelect.tsx
import type { Control, FieldValues, Path } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'

interface Option {
  value: string
  label: string
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  options: Option[]
  fullWidth?: boolean
}

export function FormSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  fullWidth = false,
}: FormSelectProps<T>): JSX.Element {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control })

  return (
    <FormControl fullWidth={fullWidth} error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select {...field} label={label}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  )
}
