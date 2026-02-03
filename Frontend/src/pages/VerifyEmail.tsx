import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import api from '../lib/api'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('Verificando tu cuenta...')
  const verifyCalled = useRef(false)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token de verificación no encontrado.')
      return
    }

    if (verifyCalled.current) return
    verifyCalled.current = true

    const verifyToken = async () => {
      try {
        // Intentamos verificar con el backend
        // Ajusta la ruta '/auth/verify-email' según tu backend
        await api.post('/auth/verify-email', { token })
        
        setStatus('success')
        setMessage('¡Correo verificado correctamente!')
        
        // Redirigir automáticamente después de unos segundos
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (error: any) {
        console.error('Error verifying email:', error)
        setStatus('error')
        // Extraer mensaje de error si está disponible
        const msg = error.response?.data?.message || 'El enlace de verificación es inválido o ha expirado.'
        setMessage(typeof msg === 'string' ? msg : 'Error al verificar el correo.')
      }
    }

    verifyToken()
  }, [token, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 relative overflow-hidden">
       {/* Background Image with Overlay */}
       <div className="absolute inset-0 z-0">
        <img 
          src="/images/training-bg.webp" 
          alt="Training background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-primary/40"></div>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 text-center animate-fade-scale">
          <div className="flex flex-col items-center justify-center space-y-4">
            
            {status === 'verifying' && (
              <>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verificando...</h1>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">¡Cuenta Verificada!</h1>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Error de verificación</h1>
              </>
            )}

            <p className="text-gray-600 dark:text-gray-300 text-center">
              {message}
            </p>

            {status !== 'verifying' && (
              <button
                onClick={() => navigate('/login')}
                className="mt-4 w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
              >
                Ir a Iniciar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
