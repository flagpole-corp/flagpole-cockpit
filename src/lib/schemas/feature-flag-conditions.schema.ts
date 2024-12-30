import { z } from 'zod'

export const conditionSchema = z.object({
  operator: z.enum(['AND', 'OR']),
  conditions: z.array(
    z.discriminatedUnion('type', [
      z.object({
        type: z.literal('percentage'),
        value: z.number().min(0).max(100),
        attribute: z.string().optional(),
      }),
      z.object({
        type: z.literal('user'),
        rules: z.object({
          email: z.array(z.string().email()).optional(),
          emailDomain: z.array(z.string()).optional(),
          userId: z.array(z.string()).optional(),
          userType: z.array(z.string()).optional(),
        }),
      }),
      z.object({
        type: z.literal('time'),
        rules: z.object({
          startDate: z.string().optional(),
          endDate: z.string().optional(),
          timeZone: z.string().optional(),
          daysOfWeek: z.array(z.number().min(0).max(6)).optional(), // 0-6 for Sunday-Saturday
          hours: z.array(z.number().min(0).max(23)).optional(), // 0-23 for hours
        }),
      }),
      z.object({
        type: z.literal('geo'),
        rules: z.object({
          countries: z.array(z.string()).optional(),
          regions: z.array(z.string()).optional(),
          allowList: z.boolean().optional(),
        }),
      }),
      z.object({
        type: z.literal('device'),
        rules: z.object({
          browsers: z.array(z.string()).optional(),
          os: z.array(z.string()).optional(),
          versions: z.array(z.string()).optional(),
          mobile: z.boolean().optional(),
        }),
      }),
      z.object({
        type: z.literal('custom'),
        rules: z.array(
          z.object({
            attribute: z.string(),
            operator: z.enum(['equals', 'contains', 'startsWith', 'endsWith', 'regex']),
            values: z.array(z.string()),
          })
        ),
      }),
    ])
  ),
})

export type FeatureFlagConditions = z.infer<typeof conditionSchema>

export type PercentageCondition = Extract<z.infer<typeof conditionSchema>['conditions'][number], { type: 'percentage' }>
export type UserCondition = Extract<z.infer<typeof conditionSchema>['conditions'][number], { type: 'user' }>
export type TimeCondition = Extract<z.infer<typeof conditionSchema>['conditions'][number], { type: 'time' }>
export type GeoCondition = Extract<z.infer<typeof conditionSchema>['conditions'][number], { type: 'geo' }>
export type DeviceCondition = Extract<z.infer<typeof conditionSchema>['conditions'][number], { type: 'device' }>
export type CustomCondition = Extract<z.infer<typeof conditionSchema>['conditions'][number], { type: 'custom' }>
