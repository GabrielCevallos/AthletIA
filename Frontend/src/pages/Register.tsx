import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    setSuccessMessage(null)
    try {
      console.log('Intentando registrar usuario...')
      await registerUser(data.email, data.password)
      console.log('Registro exitoso, navegando a check-email')
      // Redirigir a la página de CheckEmail con el email del usuario
      navigate('/check-email', { state: { email: data.email }, replace: true })
    } catch (err: any) {
      let msg = err?.response?.data?.message
      if (Array.isArray(msg)) msg = msg.join(', ')
      if (!msg) msg = 'Error al registrar la cuenta'
      setServerError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900 relative overflow-hidden">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.6s ease-out;
        }
        .animate-fade-scale {
          animation: fadeInScale 0.5s ease-out;
        }
        .auth-container {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.98) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .dark .auth-container {
          background: linear-gradient(135deg, rgba(26, 40, 49, 0.95) 0%, rgba(13, 20, 28, 0.98) 100%);
          border: 1px solid rgba(50, 85, 103, 0.3);
        }
      `}</style>

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

      {/* Main Content */}
      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
        {/* Left Side - Image/Branding (Hidden on mobile) */}
        <div className="hidden lg:flex flex-col justify-center items-center text-white px-8 animate-slide-in">
          <div className="text-center">
            <h1 className="text-5xl font-black mb-4 leading-tight">
              <span className="block">AthletIA</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 font-light">¡Comienza tu transformación hoy!</p>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-gray-300">Rutinas personalizadas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-gray-300">Seguimiento de medidas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-gray-300">Análisis de progreso</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex items-center justify-center p-6 lg:p-12 animate-fade-scale">
          <div className="auth-container rounded-2xl shadow-2xl w-full max-w-lg p-10 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2">
                Crear Cuenta
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Crea una cuenta nueva</p>
            </div>

            {serverError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg animate-slide-in" role="alert">
                <p className="text-red-700 dark:text-red-300 text-sm font-semibold">{serverError}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg animate-slide-in" role="alert">
                <p className="text-green-700 dark:text-green-300 text-sm font-semibold">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email Input */}
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    {...register('email')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className="w-full px-5 py-4 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition duration-200"
                  />
                  {!errors.email && (
                    <svg className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586 5.313 11.899a1 1 0 00-1.414 1.414l5.5 5.5a1 1 0 001.414 0l8.202-8.202z" clipRule="evenodd" /></svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className="w-full px-5 py-4 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition duration-200"
                />
                {errors.password && (
                  <p id="password-error" className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586 5.313 11.899a1 1 0 00-1.414 1.414l5.5 5.5a1 1 0 001.414 0l8.202-8.202z" clipRule="evenodd" /></svg>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                  className="w-full px-5 py-4 bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition duration-200"
                />
                {errors.confirmPassword && (
                  <p id="confirm-password-error" className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586 5.313 11.899a1 1 0 00-1.414 1.414l5.5 5.5a1 1 0 001.414 0l8.202-8.202z" clipRule="evenodd" /></svg>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  required
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition">
                  Acepto los términos y condiciones de servicio
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-6 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-bold text-lg rounded-lg transition duration-200 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 shadow-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-medium">o regístrate con</span>
              </div>
            </div>

            {/* Google SignUp */}
            <a
              href={((import.meta as any).env?.VITE_GOOGLE_AUTH_URL ?? 'http://localhost:3000/auth/google')}
              className="w-full py-4 flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 font-semibold shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </a>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                ¿Ya tienes cuenta?{' '}
                <Link
                  to="/login"
                  className="text-primary font-bold hover:text-primary/80 transition inline-flex items-center gap-1"
                >
                  Inicia sesión
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
