import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import type { User } from '~/lib/queries/auth'
import { useUser, useLogin, useLogout, useGoogleLogin } from '~/lib/queries/auth'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  error: Error | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const token = localStorage.getItem('token')
  const { data: user, isLoading, error } = useUser()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const googleLoginMutation = useGoogleLogin()

  const login = async (email: string, password: string): Promise<void> => {
    await loginMutation.mutateAsync({ email, password })
  }

  const loginWithGoogle = async (): Promise<void> => {
    await googleLoginMutation.mutateAsync(undefined)
  }

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync(undefined)
  }

  const isActuallyLoading = token ? isLoading : false

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isAuthenticated: !!user,
        isLoading: isActuallyLoading || loginMutation.isPending,
        login,
        loginWithGoogle,
        logout,
        error: error || loginMutation.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
