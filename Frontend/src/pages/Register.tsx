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
      await registerUser(data.email, data.password)
      setSuccessMessage('Cuenta creada exitosamente. Redirigiendo al login...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      let msg = err?.response?.data?.message
      if (Array.isArray(msg)) msg = msg.join(', ')
      if (!msg) msg = 'Error al registrar la cuenta'
      setServerError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-background-dark relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-[#325567] bg-white dark:bg-[#1a2831] p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Crear cuenta</h1>
        <p className="text-sm text-gray-500 dark:text-[#92b7c9] mb-6">Regístrate para comenzar</p>
        
        {serverError && <div className="mb-4 text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-900">{serverError}</div>}
        {successMessage && <div className="mb-4 text-green-500 text-sm p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-900">{successMessage}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
            <input id="email" type="email" {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Contraseña</label>
            <input id="password" type="password" {...register('password')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Confirmar Contraseña</label>
            <input id="confirmPassword" type="password" {...register('confirmPassword')}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          <button disabled={isSubmitting} className="w-full h-10 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 focus-visible:ring-2 ring-primary disabled:opacity-50">
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        <div className="mt-4 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">¿Ya tienes cuenta? </span>
            <Link to="/login" className="text-sm font-bold text-primary hover:text-primary/80">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  )
}
