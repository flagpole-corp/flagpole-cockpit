export interface CreateOrganizationRequest {
  name: string
  ownerEmail: string
  ownerName: string
  plan: 'TRIAL' | 'IC' | 'PRO' | 'ENTERPRISE'
  settings?: {
    defaultEnvironments?: string[]
    allowedDomains?: string[]
    notificationEmails?: string[]
  }
}
