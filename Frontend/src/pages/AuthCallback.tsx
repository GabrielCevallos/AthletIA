import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { loginWithTokens } = useAuth()

  useEffect(() => {
    console.log('🔗 AuthCallback: parseando URL hash')
    console.log('🔗 Full hash:', window.location.hash)
    const hash = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hash.get('accessToken')
    const refreshToken = hash.get('refreshToken')
    const accountId = hash.get('accountId')

    console.log('🔗 Tokens extraídos:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accountId,
    })

    if (accessToken && refreshToken) {
      console.log('✅ Tokens válidos, llamando loginWithTokens')
      loginWithTokens(accessToken, refreshToken, accountId || undefined)
      console.log('✅ Esperando actualización de estado...')
      // Esperar un tick para que React actualice el estado antes de navegar
      setTimeout(() => {
        console.log('✅ Redirigiendo a dashboard')
        navigate('/dashboard', { replace: true })
      }, 100)
    } else {
      console.log('❌ Tokens inválidos, redirigiendo a login')
      navigate('/login', { replace: true })
    }
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
