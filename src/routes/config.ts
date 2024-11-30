import type { ReactNode } from 'react'

export interface BaseRouteConfig {
  title?: string
  element?: ReactNode
  errorElement?: ReactNode
}

export interface IndexRouteConfig extends BaseRouteConfig {
  index: true
  path?: never
}

export interface NonIndexRouteConfig extends BaseRouteConfig {
  index?: false
  path: string
  children?: RouteConfig[]
}

export type RouteConfig = IndexRouteConfig | NonIndexRouteConfig
