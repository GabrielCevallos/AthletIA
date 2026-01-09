import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import api from '../lib/api'

type AuthCtx = {
  accountId?: string
  isAuthenticated: boolean
  role?: string
  login: (email: string, password: string) => Promise<void>
  loginWithTokens: (accessToken: string, refreshToken: string, accountId?: string, role?: string) => void
  logout: () => Promise<void>
}
const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountId] = useState<string | undefined>(() => localStorage.getItem('accountId') || undefined)
  const [role, setRole] = useState<string | undefined>(() => {
    const storedRole = localStorage.getItem('userRole') || undefined
    console.log('🚀 AuthProvider inicializado - Rol desde localStorage:', storedRole)
    return storedRole
  })
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('accessToken'))

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('accessToken'))
    console.log('📊 Estado de autenticación actualizado - Role actual:', role, 'isAuthenticated:', isAuthenticated)
  }, [accountId, role, isAuthenticated])

  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔐 Iniciando login con:', email)
      const { data } = await api.post('/auth/login', { email, password })
      console.log('✅ Respuesta del backend:', data)
      
      const accessToken = data.data?.accessToken || data.accessToken
      const refreshToken = data.data?.refreshToken || data.refreshToken
      const accountId = data.data?.accountId || data.accountId

      // Decodificar el token para obtener el rol
      let userRole: string | undefined
      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]))
          console.log('📋 Token payload decodificado:', payload)
          userRole = payload.role
          console.log('👤 Rol extraído del token:', userRole)
        } catch (e) {
          console.warn('⚠️ No se pudo decodificar el token para obtener el rol:', e)
        }
      }

      if (accessToken) localStorage.setItem('accessToken', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
      if (accountId) localStorage.setItem('accountId', accountId)
      if (userRole) {
        localStorage.setItem('userRole', userRole)
        console.log('💾 Rol guardado en localStorage:', userRole)
      }
      
      setAccountId(accountId)
      setRole(userRole)
      setIsAuthenticated(true)
      console.log('✅ Login exitoso, rol asignado al contexto:', userRole)
    } catch (error: any) {
      console.error('❌ Error en login:', error)
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      throw error
    }
  }, [])

  const loginWithTokens = useCallback((accessToken: string, refreshToken: string, accountId?: string, role?: string) => {
    console.log('🎫 loginWithTokens llamado con:', { accessToken: accessToken?.substring(0, 20) + '...', accountId, role })
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    if (accountId) localStorage.setItem('accountId', accountId)
    if (role) localStorage.setItem('userRole', role)
    setAccountId(accountId)
    setRole(role)
    setIsAuthenticated(true)
    console.log('✅ Tokens guardados, isAuthenticated:', true)
  }, [])

  const logout = useCallback(async () => {
    const id = localStorage.getItem('accountId')
    if (id) await api.post('/auth/logout', { accountId: id }).catch(() => {})
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('accountId')
    localStorage.removeItem('userRole')
    setAccountId(undefined)
    setRole(undefined)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(() => ({ accountId, role, isAuthenticated, login, loginWithTokens, logout }), [accountId, role, isAuthenticated, login, loginWithTokens, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
