import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Gender, RoutineGoal } from '../types'
import api from '../lib/api'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../context/AuthContext'

// Schema using translation keys for error messages
const createSchema = () => z.object({
  name: z.string().min(1, 'complete_profile.validation.name_required'),
  birthDate: z.string().min(1, 'complete_profile.validation.birthdate_required'),
  phoneNumber: z.string().length(10, 'complete_profile.validation.phone_length').regex(/^\d+$/, 'complete_profile.validation.phone_digits'),
  gender: z.nativeEnum(Gender, { errorMap: () => ({ message: 'complete_profile.validation.gender_invalid' }) }),
  fitGoals: z.array(z.nativeEnum(RoutineGoal)).min(1, 'complete_profile.validation.goals_min'),
})

type FormData = z.infer<ReturnType<typeof createSchema>>

export default function CompleteProfile() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const { hasProfile, checkProfileStatus } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const schema = createSchema()

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fitGoals: []
    }
  })

  // Protección: Si ya tiene perfil, al dashboard
  useEffect(() => {
    if (hasProfile === true) {
      navigate('/dashboard', { replace: true })
    }
  }, [hasProfile, navigate])

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      console.log('📤 Enviando perfil:', data)
      await api.post('profiles/complete-setup', data)
      console.log('✅ Perfil completado exitosamente')
      setSuccessMessage(t('complete_profile.success_message'))
      await checkProfileStatus() // Actualizar estado global
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 2000)
    } catch (err: any) {
      console.error('❌ Error completando perfil:', err)
      let msg = err?.response?.data?.message
      if (Array.isArray(msg)) msg = msg.join(', ')
      if (!msg) msg = t('complete_profile.error_default')
      setServerError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50 dark:bg-background-dark relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-2xl rounded-xl border border-gray-200 dark:border-[#325567] bg-white dark:bg-[#1a2831] p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('complete_profile.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-[#92b7c9] mb-6">{t('complete_profile.subtitle')}</p>
        
        {(location.state as any)?.message && !successMessage && (
          <div className="mb-4 text-blue-500 text-sm p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-900">
            {(location.state as any).message}
          </div>
        )}

        {serverError && <div className="mb-4 text-red-500 text-sm p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-900">{serverError}</div>}
        {successMessage && <div className="mb-4 text-green-500 text-sm p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-900">{successMessage}</div>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('complete_profile.labels.name')}</label>
              <input id="name" type="text" {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{t(errors.name.message || '')}</p>}
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('complete_profile.labels.birthdate')}</label>
              <input id="birthDate" type="date" {...register('birthDate')}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
              {errors.birthDate && <p className="mt-1 text-xs text-red-500">{t(errors.birthDate.message || '')}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('complete_profile.labels.phone')}</label>
              <input id="phoneNumber" type="tel" maxLength={10} {...register('phoneNumber')}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
              {errors.phoneNumber && <p className="mt-1 text-xs text-red-500">{t(errors.phoneNumber.message || '')}</p>}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-200">{t('complete_profile.labels.gender')}</label>
              <select id="gender" {...register('gender')}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-900 dark:text-white focus:ring-primary focus:border-primary">
                <option value="">{t('complete_profile.placeholders.select')}</option>
                <option value={Gender.MALE}>{t('complete_profile.gender_options.male')}</option>
                <option value={Gender.FEMALE}>{t('complete_profile.gender_options.female')}</option>
              </select>
              {errors.gender && <p className="mt-1 text-xs text-red-500">{t(errors.gender.message || '')}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{t('complete_profile.labels.goals')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border border-gray-200 dark:border-[#325567] rounded-md">
              <Controller
                name="fitGoals"
                control={control}
                render={({ field }) => (
                  <>
                    {Object.values(RoutineGoal).map((goal) => (
                      <label key={goal} className="flex items-center space-x-2 p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          value={goal}
                          checked={(field.value || []).includes(goal)}
                          onChange={(e) => {
                            const value = e.target.value as RoutineGoal;
                            const currentValues = field.value || [];
                            const newValues = e.target.checked
                              ? [...currentValues, value]
                              : currentValues.filter((v) => v !== value);
                            field.onChange(newValues);
                          }}
                          className="rounded text-primary focus:ring-primary bg-white dark:bg-[#1a2831] border-gray-300 dark:border-[#325567]"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-200">{t(`complete_profile.goals.${goal}`)}</span>
                      </label>
                    ))}
                  </>
                )}
              />
            </div>
            {errors.fitGoals && <p className="mt-1 text-xs text-red-500">{t(errors.fitGoals.message || '')}</p>}
          </div>

          <button disabled={isSubmitting} className="w-full h-11 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 focus-visible:ring-2 ring-primary disabled:opacity-50 mt-6">
            {isSubmitting ? t('complete_profile.submit.loading') : t('complete_profile.submit.default')}
          </button>
        </form>
      </div>
    </div>
  )
}
