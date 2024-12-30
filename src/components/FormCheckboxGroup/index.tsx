import type { Control, FieldValues, Path } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, FormHelperText } from '@mui/material'

type FormCheckboxGroupProps<T extends FieldValues, K extends Path<T>> = {
  control: Control<T>
  name: K
  label: string
  options: Array<{
    value: string | number | boolean
    label: string
  }>
  helperText?: string
}

export function FormCheckboxGroup<T extends FieldValues, K extends Path<T>>({
  control,
  name,
  label,
  options,
  helperText,
}: FormCheckboxGroupProps<T, K>): JSX.Element {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  const currentValue = Array.isArray(value) ? value : value ? [value] : []

  const handleChange = (optionValue: string | number | boolean) => (): void => {
    const newValue = currentValue.includes(optionValue as never)
      ? currentValue.filter((v) => v !== optionValue)
      : [...currentValue, optionValue]
    onChange(newValue)
  }

  return (
    <FormControl error={!!error} component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={String(option.value)}
            control={
              <Checkbox checked={currentValue.includes(option.value as never)} onChange={handleChange(option.value)} />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      {(error || helperText) && <FormHelperText>{error ? error.message : helperText}</FormHelperText>}
    </FormControl>
  )
}
