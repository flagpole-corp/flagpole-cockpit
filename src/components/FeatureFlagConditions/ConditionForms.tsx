import { Box, Stack, Paper, IconButton, Typography, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Controller, type Control } from 'react-hook-form'
import { FormTextField } from '~/components/FormTextField'
import { FormSelect } from '~/components/FormSelect'
import { FormCheckboxGroup } from '~/components/FormCheckboxGroup'
import type { FeatureFlagFormData } from '~/lib/types/feature-flags'
import type { ChangeEvent } from 'react'
import { FormDateTimePicker } from '../FormDatepickerField'

interface BaseConditionFormProps {
  control: Control<FeatureFlagFormData>
  index: number
  onDelete: () => void
}

export const PercentageConditionForm = ({ control, index, onDelete }: BaseConditionFormProps): JSX.Element => (
  <Paper sx={{ p: 1 }}>
    <Stack spacing={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Percentage Rollout</Typography>
        <IconButton onClick={onDelete} size="small">
          <DeleteIcon />
        </IconButton>
      </Box>
      <Controller
        name={`conditions.conditions.${index}.value`}
        control={control}
        render={({ field }): JSX.Element => (
          <TextField
            {...field}
            label="Percentage"
            type="number"
            fullWidth
            inputProps={{ min: 0, max: 100 }}
            onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void =>
              field.onChange(Number(e.target.value))
            }
          />
        )}
      />
      <FormTextField
        control={control}
        name={`conditions.conditions.${index}.attribute` as const}
        label="Attribute (optional)"
        fullWidth
        helperText="e.g., userId, sessionId"
      />
    </Stack>
  </Paper>
)

export const UserConditionForm = ({ control, index, onDelete }: BaseConditionFormProps): JSX.Element => (
  <Paper sx={{ p: 2 }}>
    <Stack spacing={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">User Targeting</Typography>
        <IconButton onClick={onDelete} size="small">
          <DeleteIcon />
        </IconButton>
      </Box>
      <FormTextField
        control={control}
        name={`conditions.conditions.${index}.rules.email` as const}
        label="Email Addresses"
        fullWidth
        helperText="Semicolon-separated email addresses"
      />
      <FormTextField
        control={control}
        name={`conditions.conditions.${index}.rules.emailDomain` as const}
        label="Email Domains"
        fullWidth
        helperText="Semicolon-separated domains (e.g., example.com)"
      />
      <FormTextField
        control={control}
        name={`conditions.conditions.${index}.rules.userId` as const}
        label="User IDs"
        fullWidth
        helperText="Semicolon-separated user IDs"
      />
      <FormTextField
        control={control}
        name={`conditions.conditions.${index}.rules.userType`}
        label="User Types"
        fullWidth
        helperText="Semicolon-separated user types"
      />
    </Stack>
  </Paper>
)

export const TimeConditionForm = ({ control, index, onDelete }: BaseConditionFormProps): JSX.Element => (
  <Paper sx={{ p: 2 }}>
    <Stack spacing={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Time-based</Typography>
        <IconButton onClick={onDelete} size="small">
          <DeleteIcon />
        </IconButton>
      </Box>
      <FormDateTimePicker
        control={control}
        name={`conditions.conditions.${index}.rules.startDate` as const}
        label="Start Date"
      />

      <FormDateTimePicker
        control={control}
        name={`conditions.conditions.${index}.rules.endDate` as const}
        label="End Date"
      />
      {/* <FormTextField
        slotProps={{ inputLabel: { shrink: true } }}
        control={control}
        name={`conditions.conditions.${index}.rules.startDate` as const}
        type="datetime-local"
        label="Start Date"
        fullWidth
      />
      <FormTextField
        slotProps={{ inputLabel: { shrink: true } }}
        control={control}
        name={`conditions.conditions.${index}.rules.endDate`}
        type="datetime-local"
        label="End Date"
        fullWidth
      /> */}
      <FormSelect
        control={control}
        name={`conditions.conditions.${index}.rules.timeZone`}
        label="Timezone"
        options={[
          { value: 'UTC', label: 'UTC' },
          { value: 'America/New_York', label: 'Eastern Time' },
          { value: 'America/Los_Angeles', label: 'Pacific Time' },
        ]}
        fullWidth
      />
      <FormCheckboxGroup
        control={control}
        name={`conditions.conditions.${index}.rules.daysOfWeek`}
        label="Days of Week"
        options={[
          { value: '0', label: 'Sunday' },
          { value: '1', label: 'Monday' },
          { value: '2', label: 'Tuesday' },
          { value: '3', label: 'Wednesday' },
          { value: '4', label: 'Thursday' },
          { value: '5', label: 'Friday' },
          { value: '6', label: 'Saturday' },
        ]}
      />
    </Stack>
  </Paper>
)

export const GeoConditionForm = ({ control, index, onDelete }: BaseConditionFormProps): JSX.Element => (
  <Paper sx={{ p: 2 }}>
    <Stack spacing={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Location Targeting</Typography>
        <IconButton onClick={onDelete} size="small">
          <DeleteIcon />
        </IconButton>
      </Box>
      <FormTextField
        control={control}
        name={`conditions.conditions.${index}.rules.countries`}
        label="Country Codes"
        fullWidth
        helperText="Comma-separated country codes (e.g., US, UK, BR)"
      />
      <FormTextField
        control={control}
        name={`conditions.conditions.${index}.rules.regions`}
        label="Regions"
        fullWidth
        helperText="Comma-separated regions or states"
      />
      <FormCheckboxGroup
        control={control}
        name={`conditions.conditions.${index}.rules.allowList`}
        label="Access Type"
        options={[
          { value: true, label: 'Allow Listed Locations' },
          { value: false, label: 'Block Listed Locations' },
        ]}
      />
    </Stack>
  </Paper>
)

export const DeviceConditionForm = ({ control, index, onDelete }: BaseConditionFormProps): JSX.Element => (
  <Paper sx={{ p: 2 }}>
    <Stack spacing={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Device Targeting</Typography>
        <IconButton onClick={onDelete} size="small">
          <DeleteIcon />
        </IconButton>
      </Box>
      <FormCheckboxGroup
        control={control}
        name={`conditions.conditions.${index}.rules.browsers`}
        label="Browsers"
        options={[
          { value: 'chrome', label: 'Chrome' },
          { value: 'firefox', label: 'Firefox' },
          { value: 'safari', label: 'Safari' },
          { value: 'edge', label: 'Edge' },
        ]}
      />
      <FormCheckboxGroup
        control={control}
        name={`conditions.conditions.${index}.rules.os`}
        label="Operating Systems"
        options={[
          { value: 'windows', label: 'Windows' },
          { value: 'macos', label: 'MacOS' },
          { value: 'ios', label: 'iOS' },
          { value: 'android', label: 'Android' },
          { value: 'linux', label: 'Linux' },
        ]}
      />
      <FormTextField
        control={control}
        name={`conditions.conditions.${index}.rules.versions`}
        label="App Versions"
        fullWidth
        helperText="Comma-separated version numbers (e.g., 1.0.0, 1.1.0)"
      />
      <FormCheckboxGroup
        control={control}
        name={`conditions.conditions.${index}.rules.mobile`}
        label="Device Type"
        options={[{ value: true, label: 'Mobile Devices Only' }]}
      />
    </Stack>
  </Paper>
)
