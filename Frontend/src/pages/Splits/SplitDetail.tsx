import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Calendar } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import { getSplitById, deleteSplit, Split, Days } from '../../lib/splitStore'
import { getRoutineById } from '../../lib/routineStore'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'

export default function SplitDetail() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [split, setSplit] = useState<Split | null>(null)

  const DAY_LABELS: Record<Days, string> = {
    MONDAY: t('splits.days.monday'),
    TUESDAY: t('splits.days.tuesday'),
    WEDNESDAY: t('splits.days.wednesday'),
    THURSDAY: t('splits.days.thursday'),
    FRIDAY: t('splits.days.friday'),
    SATURDAY: t('splits.days.saturday'),
    SUNDAY: t('splits.days.sunday'),
  }

  useEffect(() => {
    if (id) {
      const found = getSplitById(id)
      if (found) {
        setSplit(found)
      } else {
        Swal.fire({
          title: t('splits.delete.not_found'),
          icon: 'error',
        }).then(() => navigate('/splits'))
      }
    }
  }, [id, navigate, t])

  const handleDelete = async () => {
    if (!split) return

    const result = await Swal.fire({
      title: t('splits.delete.confirm_title'),
      text: t('splits.delete.confirm_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonText: t('splits.delete.cancel_button'),
      confirmButtonText: t('splits.delete.confirm_button'),
    })

    if (result.isConfirmed) {
      deleteSplit(split.id)
      await Swal.fire({
        title: t('splits.delete.success_title'),
        icon: 'success',
        timer: 1600,
        timerProgressBar: true,
        showConfirmButton: false,
      })
      navigate('/splits')
    }
  }

  if (!split) {
    return (
      <Layout>
        <div className="text-gray-500 dark:text-gray-300">{t('splits.detail.loading')}</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl">
        <button
          onClick={() => navigate('/splits')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm mb-2"
        >
          <ArrowLeft size={18} /> {t('splits.form.back_button')}
        </button>

        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-black">
              {split.name}
            </h1>
            {split.description && (
              <p className="text-gray-500 dark:text-gray-300 text-sm">{split.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/splits/${split.id}/edit`)}
              className="flex items-center gap-2 border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm font-medium"
            >
              <Edit size={16} /> {t('splits.detail.edit_button')}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 border border-red-300 dark:border-red-500/30 rounded-lg px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-sm font-medium"
            >
              <Trash2 size={16} /> {t('splits.detail.delete_button')}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Resumen */}
          <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 sm:p-6 flex flex-col gap-3 shadow-card-md">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{t('splits.detail.summary_title')}</h2>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('splits.form.training_days')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{split.nTrainingDays}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('splits.form.rest_days')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{split.nRestDays}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">{t('splits.detail.official')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {split.official ? t('splits.detail.yes') : t('splits.detail.no')}
                </span>
              </div>
            </div>
          </div>

          {/* Días seleccionados */}
          <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 sm:p-6 flex flex-col gap-3 shadow-card-md">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">{t('splits.detail.training_days_title')}</h2>
            <div className="flex flex-wrap gap-2">
              {split.trainingDays.length > 0 ? (
                split.trainingDays.map((day) => (
                  <span
                    key={day}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                  >
                    {DAY_LABELS[day]}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('splits.detail.no_days_assigned')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Rutinas asignadas por día */}
        {split.routineSchedule && Object.keys(split.routineSchedule).length > 0 && (
          <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 sm:p-6 flex flex-col gap-4 shadow-card-md">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
              <Calendar size={20} /> {t('splits.detail.routines_schedule_title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {split.trainingDays.map((day) => {
                const routineId = split.routineSchedule?.[day]
                const routine = routineId ? getRoutineById(routineId) : null
                return (
                  <div
                    key={day}
                    className="border border-gray-200 dark:border-white/10 rounded-lg p-3 flex flex-col gap-1"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {DAY_LABELS[day]}
                    </span>
                    {routine ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {routine.name}
                        </span>
                        <button
                          onClick={() => navigate(`/routines/${routine.id}`)}
                          className="text-xs text-primary hover:text-primary/80 font-medium"
                        >
                          {t('splits.detail.see_routine')}
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                        {t('splits.detail.no_routine')}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
