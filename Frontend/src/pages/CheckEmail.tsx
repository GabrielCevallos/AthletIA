import { useLocation, Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { Mail } from 'lucide-react'

export default function CheckEmail() {
  const location = useLocation()
  const email = location.state?.email || 'tu correo electrónico'

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

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 text-center animate-fade-scale">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verifica tu correo
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Hemos enviado un enlace de confirmación a <br />
            <span className="font-semibold text-gray-900 dark:text-white">{email}</span>
          </p>

          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Haz clic en el enlace del correo para activar tu cuenta y comenzar a usar Athletia.
            </p>
            
            <Link 
              to="/login" 
              className="block w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
