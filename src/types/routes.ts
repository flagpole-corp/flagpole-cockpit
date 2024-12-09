import type { APP_ROUTES } from '../routes'

export type AppRoute = {
  path: string
  protected?: boolean
  guestOnly?: boolean
  adminOnly?: boolean
}

export type AppRoutes = typeof APP_ROUTES

export type RouteParams<T extends string> = T extends `${string}/:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof RouteParams<`/${Rest}`>]: string }
  : T extends `${string}/:${infer Param}`
  ? { [K in Param]: string }
  : never
