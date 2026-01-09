import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { loginWithTokens } = useAuth()

  useEffect(() => {
    const processLogin = async () => {
      console.log('🔗 AuthCallback: parseando URL hash')
      const hash = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hash.get('accessToken')
      const refreshToken = hash.get('refreshToken')
      const accountId = hash.get('accountId')

      if (accessToken && refreshToken) {
        console.log('✅ Tokens válidos, llamando loginWithTokens')
        loginWithTokens(accessToken, refreshToken, accountId || undefined)
        
        try {
          console.log('🔍 Verificando estado del perfil...')
          const { data: user } = await api.get('auth/me')
          
          console.log('👤 Estado del usuario:', user)
          if (user.data.hasProfile) {
            console.log('✅ Perfil completo, redirigiendo a dashboard')
            navigate('/dashboard', { replace: true })
          } else {
            console.log('⚠️ Perfil incompleto, redirigiendo a completar perfil')
            navigate('/complete-profile', { replace: true })
          }
        } catch (error) {
          console.error('❌ Error verificando perfil:', error)
          navigate('/login', { replace: true })
        }
      } else {
        console.log('❌ Tokens inválidos, redirigiendo a login')
        navigate('/login', { replace: true })
      }
    }

    processLogin()
  }, [navigate, loginWithTokens])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-900 dark:text-white text-lg">Autenticando...</p>
      </div>
    </div>
  )
}
