import { useFieldArray } from 'react-hook-form'
import { Stack, Box, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import type { Control } from 'react-hook-form'
import { FormSelect } from '~/components/forms/FormSelect'
import {
  PercentageConditionForm,
  UserConditionForm,
  TimeConditionForm,
  GeoConditionForm,
  DeviceConditionForm,
  // CustomConditionForm,
} from './ConditionForms'
import type { FeatureFlagCondition, FeatureFlagFormData } from '~/lib/types/feature-flags'

const CONDITION_TYPES = {
  percentage: {
    label: 'Percentage Rollout',
    component: PercentageConditionForm,
    defaultValues: {
      type: 'percentage',
      value: 0,
    },
  },
  user: {
    label: 'User Targeting',
    component: UserConditionForm,
    defaultValues: {
      type: 'user',
      rules: {
        email: [],
        emailDomain: [],
        userId: [],
        userType: [],
      },
    },
  },
  time: {
    label: 'Time-based',
    component: TimeConditionForm,
    defaultValues: {
      type: 'time',
      rules: {
        startDate: '',
        endDate: '',
        timeZone: 'UTC',
        daysOfWeek: [],
        hours: [],
      },
    },
  },
  geo: {
    label: 'Location Targeting',
    component: GeoConditionForm,
    defaultValues: {
      type: 'geo',
      rules: {
        countries: [],
        regions: [],
        allowList: true,
      },
    },
  },
  device: {
    label: 'Device Targeting',
    component: DeviceConditionForm,
    defaultValues: {
      type: 'device',
      rules: {
        browsers: [],
        os: [],
        versions: [],
        mobile: false,
      },
    },
  },
  // custom: {
  //   label: 'Custom Rule',
  //   component: CustomConditionForm,
  //   defaultValues: {
  //     type: 'custom',
  //     rules: [
  //       {
  //         attribute: '',
  //         operator: 'equals',
  //         values: [],
  //       },
  //     ],
  //   },
  // },
} as const

interface FeatureFlagConditionsProps {
  control: Control<FeatureFlagFormData>
  name: 'conditions'
}

export function FeatureFlagConditions({ control, name }: FeatureFlagConditionsProps): JSX.Element {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${name}.conditions` as const,
  })

  const addCondition = (type: keyof typeof CONDITION_TYPES): void => {
    append(CONDITION_TYPES[type].defaultValues as FeatureFlagCondition)
  }

  return (
    <Stack spacing={3}>
      <FormSelect
        control={control}
        name={`${name}.operator`}
        label="Operator"
        options={[
          { value: 'AND', label: 'Match ALL conditions (AND)' },
          { value: 'OR', label: 'Match ANY condition (OR)' },
        ]}
        fullWidth
      />

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Conditions
        </Typography>
        <Stack spacing={2}>
          {fields.map((field, index) => {
            const type = (field as unknown as { type: keyof typeof CONDITION_TYPES }).type
            const ConditionComponent = CONDITION_TYPES[type].component

            return (
              <ConditionComponent key={field.id} control={control} index={index} onDelete={(): void => remove(index)} />
            )
          })}
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Add Condition
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          {Object.entries(CONDITION_TYPES).map(([type, config]) => (
            <Button
              key={type}
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={(): void => addCondition(type as keyof typeof CONDITION_TYPES)}
            >
              {config.label}
            </Button>
          ))}
        </Stack>
      </Box>
    </Stack>
  )
}
