import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import api from '../lib/api'

type AuthCtx = {
  accountId?: string
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithTokens: (accessToken: string, refreshToken: string, accountId?: string) => void
  logout: () => Promise<void>
}
const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountId] = useState<string | undefined>(() => localStorage.getItem('accountId') || undefined)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('accessToken'))

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('accessToken'))
  }, [accountId])

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando login con:', email)
      const { data } = await api.post('/auth/login', { email, password })
      console.log('✅ Respuesta del backend:', data)
      
      const accessToken = data.data?.accessToken || data.accessToken
      const refreshToken = data.data?.refreshToken || data.refreshToken
      const accountId = data.data?.accountId || data.accountId

      if (accessToken) localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
      if (accountId) localStorage.setItem('accountId', accountId)
      
      setAccountId(accountId)
      setIsAuthenticated(true)
      console.log('✅ Login exitoso')
    } catch (error: any) {
      console.error('❌ Error en login:', error)
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      throw error
    }
  }, [])

  const loginWithTokens = useCallback((accessToken: string, refreshToken: string, accountId?: string) => {
    console.log('🎫 loginWithTokens llamado con:', { accessToken: accessToken?.substring(0, 20) + '...', accountId })
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    if (accountId) localStorage.setItem('accountId', accountId)
    setAccountId(accountId)
    setIsAuthenticated(true)
    console.log('✅ Tokens guardados, isAuthenticated:', true)
  }, [])

  const logout = useCallback(async () => {
    const id = localStorage.getItem('accountId')
    if (id) await api.post('/auth/logout', { accountId: id }).catch(() => {})
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accountId')
    setAccountId(undefined)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(() => ({ accountId, isAuthenticated, login, loginWithTokens, logout }), [accountId, isAuthenticated, login, loginWithTokens, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
