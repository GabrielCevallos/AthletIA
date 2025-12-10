import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

export default function AuthCallback() {
  const navigate = useNavigate()
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hash.get('accessToken')
    const refreshToken = hash.get('refreshToken')
    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }, [navigate])
  
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
