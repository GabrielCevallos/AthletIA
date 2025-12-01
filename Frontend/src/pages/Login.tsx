import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../context/AuthContext'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      await login(data.email, data.password)
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      setServerError(err?.response?.data?.message || 'Credenciales inválidas')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-[#325567] bg-white dark:bg-[#1a2831] p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Iniciar sesión</h1>
        <p className="text-sm text-gray-500 dark:text-[#92b7c9] mb-6">Bienvenido de nuevo</p>
        {serverError && <div className="mb-4 text-red-500 text-sm" role="alert">{serverError}</div>}
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
          <a href={((import.meta as any).env?.VITE_GOOGLE_AUTH_URL ?? '')} className="w-full h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-[#325567] text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 focus-visible:ring-2 ring-primary">
            <span className="material-symbols-outlined mr-2" aria-hidden>account_circle</span>
            Entrar con Google
          </a>
        </div>
      </div>
    </div>
  )
}
