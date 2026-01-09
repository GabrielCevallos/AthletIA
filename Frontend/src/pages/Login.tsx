import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import api from '../lib/api'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [errorKey, setErrorKey] = useState(0)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      await login(data.email, data.password)

      // Verificar estado del perfil antes de redirigir
      const { data: user } = await api.get('auth/me')
      console.log('👤 Estado del usuario:', user)
      
      if (user.data.hasProfile) {
         navigate('/dashboard', { replace: true })
      } else {
         navigate('/complete-profile', { replace: true })
      }
    } catch (err: any) {
      let msg = err?.response?.data?.message
      if (msg === 'Unauthorized' || !msg) msg = 'Credenciales inválidas'
      setServerError(msg)
      setErrorKey(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-background-dark relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-[#325567] bg-white dark:bg-[#1a2831] p-6 sm:p-8">
        <style>{`
          @keyframes login-error-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
          .animate-login-blink {
            animation: login-error-blink 0.3s ease-in-out 3;
          }
        `}</style>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Iniciar sesión</h1>
        <p className="text-sm text-gray-500 dark:text-[#92b7c9] mb-6">Bienvenido de nuevo</p>
        {serverError && <div key={errorKey} className="mb-4 text-red-500 text-sm animate-login-blink" role="alert">{serverError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input id="email" type="email" autoComplete="email" {...register('email')}
              aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            {errors.email && <p id="email-error" className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Contraseña</label>
            <input id="password" type="password" autoComplete="current-password" {...register('password')}
              aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            {errors.password && <p id="password-error" className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <button disabled={isSubmitting} className="w-full h-10 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 focus-visible:ring-2 ring-primary">
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="mt-4">
          <a href={((import.meta as any).env?.VITE_GOOGLE_AUTH_URL ?? 'http://localhost:3000/auth/google')} className="w-full h-10 flex items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-[#325567] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 focus-visible:ring-2 ring-primary">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Entrar con Google
          </a>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">¿No tienes cuenta? </span>
          <Link to="/register" className="text-sm font-bold text-primary hover:text-primary/80">Regístrate</Link>
        </div>
      </div>
    </div>
  )
}
