import dayjs, { Dayjs } from 'dayjs'
import Button from '@mui/material/Button'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { UseDateFieldProps } from '@mui/x-date-pickers/DateField'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { BaseSingleInputFieldProps, DateValidationError, FieldSection } from '@mui/x-date-pickers/models'
import { Dispatch, SetStateAction, useState } from 'react'

interface ButtonFieldProps
  extends UseDateFieldProps<Dayjs, false>,
    BaseSingleInputFieldProps<Dayjs | null, Dayjs, FieldSection, false, DateValidationError> {
  setOpen?: Dispatch<SetStateAction<boolean>>
}

const ButtonField = (props: ButtonFieldProps): JSX.Element => {
  const { setOpen, label, id, disabled, InputProps: { ref } = {}, inputProps: { 'aria-label': ariaLabel } = {} } = props

  return (
    <Button
      variant="outlined"
      id={id}
      disabled={disabled}
      ref={ref}
      aria-label={ariaLabel}
      size="small"
      onClick={(): void => setOpen?.((prev) => !prev)}
      startIcon={<CalendarTodayRoundedIcon fontSize="small" />}
      sx={{ minWidth: 'fit-content' }}
    >
      {label ? `${label}` : 'Pick a date'}
    </Button>
  )
}

export const CustomDatePicker = (): JSX.Element => {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2023-04-17'))
  const [open, setOpen] = useState(false)

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={value}
        label={value == null ? null : value.format('MMM DD, YYYY')}
        onChange={(newValue): void => setValue(newValue)}
        slots={{ field: ButtonField }}
        slotProps={{
          // @ts-expect-error
          field: { setOpen },
          nextIconButton: { size: 'small' },
          previousIconButton: { size: 'small' },
        }}
        open={open}
        onClose={(): void => setOpen(false)}
        onOpen={(): void => setOpen(true)}
        views={['day', 'month', 'year']}
      />
    </LocalizationProvider>
  )
}
