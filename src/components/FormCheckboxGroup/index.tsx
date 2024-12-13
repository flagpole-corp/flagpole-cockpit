import type { Control, FieldValues, Path } from 'react-hook-form'
import { useController } from 'react-hook-form'
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, FormHelperText } from '@mui/material'

type FormCheckboxGroupProps<T extends FieldValues, K extends Path<T>, V = T[K] extends (infer U)[] ? U : never> = {
  control: Control<T>
  name: K
  label: string
  options: Array<{
    value: V
    label: string
  }>
  helperText?: string
}

export function FormCheckboxGroup<T extends FieldValues, K extends Path<T>, V = T[K] extends (infer U)[] ? U : never>({
  control,
  name,
  label,
  options,
  helperText,
}: FormCheckboxGroupProps<T, K, V>): JSX.Element {
  const {
    field: { value = [], onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  })

  const handleChange = (optionValue: V) => (): void => {
    const newValue = (value as V[]).includes(optionValue)
      ? (value as V[]).filter((v) => v !== optionValue)
      : [...(value as V[]), optionValue]
    onChange(newValue)
  }

  return (
    <FormControl error={!!error} component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={String(option.value)}
            control={<Checkbox checked={(value as V[]).includes(option.value)} onChange={handleChange(option.value)} />}
            label={option.label}
          />
        ))}
      </FormGroup>
      {(error || helperText) && <FormHelperText>{error ? error.message : helperText}</FormHelperText>}
    </FormControl>
  )
}
