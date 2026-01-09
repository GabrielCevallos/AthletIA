import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import api from '../lib/api'
import { UserRole } from '../types'

type AuthCtx = {
  accountId?: string
  isAuthenticated: boolean
  hasProfile: boolean | null // null = loading/unknown
  role: UserRole | null
  name: string | null
  checkProfileStatus: () => Promise<boolean>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  loginWithTokens: (accessToken: string, refreshToken: string, accountId?: string) => void
  logout: () => Promise<void>
}
const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountId] = useState<string | undefined>(() => localStorage.getItem('accountId') || undefined)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('accessToken'))
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [name, setName] = useState<string | null>(null)

  const checkProfileStatus = useCallback(async () => {
    try {
      if (!localStorage.getItem('accessToken')) return false
      let { data } = await api.get('auth/me')
      data = data.data || data
      setHasProfile(!!data.hasProfile)
      if (data.role) setRole(data.role)
      if (data.name) setName(data.name)
      return !!data.hasProfile
    } catch (e) {
      console.error('Error checking profile status', e)
      return false
    }
  }, [])

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('accessToken'))
    if (!!localStorage.getItem('accessToken')) {
      checkProfileStatus()
    }
  }, [accountId, checkProfileStatus])

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
      await checkProfileStatus()
      console.log('✅ Login exitoso')
    } catch (error: any) {
      console.error('❌ Error en login:', error)
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      throw error
    }
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    try {
      console.log('📝 Iniciando registro con:', email)
      await api.post('/auth/register-account', { email, password })
      console.log('✅ Registro exitoso')
    } catch (error: any) {
      console.error('❌ Error en registro:', error)
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

  const value = useMemo(() => ({ accountId, isAuthenticated, hasProfile, role, name, checkProfileStatus, login, register, loginWithTokens, logout }), [accountId, isAuthenticated, hasProfile, role, name, checkProfileStatus, login, register, loginWithTokens, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}