export const ENVIRONMENTS = ['development', 'staging', 'production'] as const
export type Environment = (typeof ENVIRONMENTS)[number]

export type ConditionType = 'user' | 'percentage' | 'time' | 'geo' | 'device' | 'custom'

export interface BaseCondition {
  type: ConditionType
  name?: string
}

export interface UserCondition extends BaseCondition {
  type: 'user'
  rules: {
    email?: string[]
    emailDomain?: string[]
    userId?: string[]
    userType?: string[]
  }
}

export interface PercentageCondition extends BaseCondition {
  type: 'percentage'
  value: number
  attribute?: string
}

export interface TimeCondition extends BaseCondition {
  type: 'time'
  rules: {
    startDate?: string
    endDate?: string
    timeZone?: string
    daysOfWeek?: number[]
    hours?: number[]
  }
}

export interface GeoCondition extends BaseCondition {
  type: 'geo'
  rules: {
    countries?: string[]
    regions?: string[]
    allowList?: boolean
  }
}

export interface DeviceCondition extends BaseCondition {
  type: 'device'
  rules: {
    browsers?: string[]
    os?: string[]
    versions?: string[]
    mobile?: boolean
  }
}

export interface CustomCondition extends BaseCondition {
  type: 'custom'
  rules: {
    attribute: string
    operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex'
    values: string[]
  }[]
}

export type Condition =
  | UserCondition
  | PercentageCondition
  | TimeCondition
  | GeoCondition
  | DeviceCondition
  | CustomCondition

export interface FeatureFlagConditions {
  operator: 'AND' | 'OR'
  conditions: Condition[]
}

export interface CustomRule {
  attribute: string
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex'
  values: string[]
}

export interface FeatureFlagCondition {
  type: 'percentage' | 'user' | 'time' | 'geo' | 'device' | 'custom'
  value?: number
  attribute?: string
  rules?: {
    email?: string[]
    emailDomain?: string[]
    userId?: string[]
    userType?: string[]
    startDate?: string
    endDate?: string
    timeZone?: string
    daysOfWeek?: string[]
    hours?: string[]
    countries?: string[]
    regions?: string[]
    allowList?: boolean
    browsers?: string[]
    os?: string[]
    versions?: string[]
    mobile?: boolean
    attribute?: string
    operator?: string
    values?: string[]
    [key: number]: CustomRule
  }
}

export interface FeatureFlagFormData {
  name: string
  description: string
  projectId: string
  environments: Environment[]
  conditions?: {
    operator: 'AND' | 'OR'
    conditions: FeatureFlagCondition[]
  }
}
