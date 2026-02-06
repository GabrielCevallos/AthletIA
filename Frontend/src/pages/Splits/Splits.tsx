import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit, Eye } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import { deleteSplit, getAllSplits, Split } from '../../lib/splitStore'
import Swal from 'sweetalert2'
import { useTranslation } from 'react-i18next'

export default function Splits() {
  const { t } = useTranslation()
  const [splits, setSplits] = useState<Split[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setSplits(getAllSplits())
  }, [])

  const handleDelete = async (id: string) => {
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
      deleteSplit(id)
      setSplits(getAllSplits())
      await Swal.fire({
        title: t('splits.delete.success_title'),
        icon: 'success',
        timer: 1600,
        timerProgressBar: true,
        showConfirmButton: false,
      })
    }
  }

  const getDayNames = (days: string[]): string => {
    const dayMap: Record<string, string> = {
      MONDAY: t('splits.days.mon'),
      TUESDAY: t('splits.days.tue'),
      WEDNESDAY: t('splits.days.wed'),
      THURSDAY: t('splits.days.thu'),
      FRIDAY: t('splits.days.fri'),
      SATURDAY: t('splits.days.sat'),
      SUNDAY: t('splits.days.sun'),
    };
    return days.map((d) => dayMap[d] || d).join(', ');
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 sm:gap-6">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-black">{t('splits.title')}</h1>
            <p className="text-gray-500 dark:text-gray-300 text-sm">{t('splits.subtitle')}</p>
          </div>
          <Link to="/splits/new" className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary whitespace-nowrap">
            <Plus size={20} /> {t('splits.new_button')}
          </Link>
        </header>

        {splits.length === 0 ? (
          <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-6 text-gray-500 dark:text-gray-300 text-center shadow-card-md">
            {t('splits.empty_state')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {splits.map((s) => (
              <div key={s.id} className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 sm:p-5 flex flex-col gap-3 hover:border-primary dark:hover:border-primary transition-colors shadow-card-md hover:shadow-lg">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 dark:text-white font-bold text-base sm:text-lg truncate">{s.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{s.nTrainingDays} {t('splits.training_days_count')}</p>
                  </div>
                  <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                    <button onClick={() => navigate(`/splits/${s.id}/edit`)} className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('splits.edit_label')}>
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 sm:p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500" aria-label={t('splits.delete_label')}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-xs text-gray-600 dark:text-gray-400">
                  {s.description && <p className="line-clamp-2">{s.description}</p>}
                  <p>{t('splits.days_label')}: {getDayNames(s.trainingDays.length > 0 ? s.trainingDays : [t('splits.unassigned')])}</p>
                </div>
                <div className="mt-auto pt-3 border-t border-gray-200 dark:border-white/10">
                  <button
                    onClick={() => navigate(`/splits/${s.id}`)}
                    className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-white/10 rounded-lg py-2 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm font-medium"
                  >
                    <Eye size={16} /> {t('splits.view_details')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
