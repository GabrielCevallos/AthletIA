import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit, FileText } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import { deleteRoutine, getAllRoutines, Routine } from '../../lib/routineStore'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'

export default function Routines() {
  const { t } = useTranslation()
  const [routines, setRoutines] = useState<Routine[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setRoutines(getAllRoutines())
  }, [])

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: t('routines.delete.confirm_title'),
      text: t('routines.delete.confirm_text'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonText: t('common.actions.cancel'),
      confirmButtonText: t('routines.delete.confirm_button'),
    })

    if (result.isConfirmed) {
      deleteRoutine(id)
      setRoutines(getAllRoutines())
      await Swal.fire({
        title: t('routines.delete.success_title'),
        icon: 'success',
        timer: 1600,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 sm:gap-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-black">{t('routines.title')}</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">{t('routines.subtitle')}</p>
        </div>
        <Link to="/routines/new" className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap">
          <Plus size={20} /> {t('routines.new_button')}
        </Link>
      </header>

      {routines.length === 0 ? (
        <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 text-gray-500 dark:text-gray-300 text-center shadow-card-md">
          {t('routines.empty_state')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {routines.map((r) => (
            <div key={r.id} className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 sm:p-5 flex flex-col gap-3 hover:border-primary dark:hover:border-primary transition-colors shadow-card-md hover:shadow-lg">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white font-bold text-base sm:text-lg truncate">{r.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{r.exercises.length} {t('routines.card.exercise_count')}</p>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <button onClick={() => navigate(`/routines/${r.id}/edit`)} className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('routines.card.edit_label')}>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 sm:p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label={t('routines.card.delete_label')}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {r.exercises.slice(0, 3).map((ex) => (
                  <span key={ex.id} className="px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 truncate max-w-full">{ex.name}</span>
                ))}
                {r.exercises.length > 3 && <span className="text-gray-500 dark:text-gray-300 text-xs">+{r.exercises.length - 3} {t('routines.card.more_exercises')}</span>}
              </div>
              <div className="flex gap-2 mt-auto">
                <Link to={`/routines/${r.id}`} className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-white/10 rounded-lg py-2 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm font-medium">
                  <FileText size={16} /> {t('routines.card.view_details')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </Layout>
  )
}
