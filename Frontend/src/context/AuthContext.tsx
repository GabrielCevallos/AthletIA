import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../lib/api'

type AuthCtx = {
  accountId?: string
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}
const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountId] = useState<string | undefined>(() => localStorage.getItem('accountId') || undefined)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('accessToken'))

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('accessToken'))
  }, [accountId])

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    if (data.accountId) localStorage.setItem('accountId', data.accountId)
    setAccountId(data.accountId)
    setIsAuthenticated(true)
  }

  async function logout() {
    const id = localStorage.getItem('accountId')
    if (id) await api.post('/auth/logout', { accountId: id }).catch(() => {})
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accountId')
    setAccountId(undefined)
    setIsAuthenticated(false)
  }

  const value = useMemo(() => ({ accountId, isAuthenticated, login, logout }), [accountId, isAuthenticated])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
