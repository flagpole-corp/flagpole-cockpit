import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import type { DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import type { TextFieldProps } from '@mui/material/TextField'
import dayjs, { type Dayjs } from 'dayjs'

interface FormDateTimePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<DateTimePickerProps<Dayjs>, 'value' | 'onChange'> {
  control: Control<TFieldValues>
  name: TName
  textFieldProps?: Partial<TextFieldProps>
}

export function FormDateTimePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ control, name, textFieldProps, ...datePickerProps }: FormDateTimePickerProps<TFieldValues, TName>): JSX.Element {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }): JSX.Element => (
        <DateTimePicker
          {...datePickerProps}
          {...field}
          value={field.value ? dayjs(field.value) : null}
          onChange={(date): void => field.onChange(date?.toISOString())}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
              ...textFieldProps,
            },
          }}
        />
      )}
    />
  )
}
