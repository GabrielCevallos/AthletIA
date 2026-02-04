import Layout from '../components/layout/Layout'
import { useTranslation } from 'react-i18next'

export default function Dashboard() {
  const { t } = useTranslation()
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <p className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-black tracking-[-0.033em]">{t('dashboard.title')}</p>
            <p className="text-gray-500 dark:text-[#92b7c9] text-sm sm:text-base">{t('dashboard.subtitle')}</p>
          </div>
        </div>

        {/* Gráfica de Usuarios Registrados */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-[#325567] bg-white dark:bg-[#1a2831] p-4 sm:p-6 shadow-card-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">{t('dashboard.registered_users')}</p>
                <p className="text-gray-900 dark:text-white text-2xl sm:text-[32px] font-bold mt-2">156</p>
              </div>
              <div className="flex gap-1 items-center">
                <p className="text-gray-500 dark:text-[#92b7c9] text-xs sm:text-sm">{t('dashboard.last_7_days')}</p>
                <p className="text-[#0bda57] text-xs sm:text-sm font-medium">+23 {t('dashboard.new_users')}</p>
              </div>
            </div>
            <div className="min-h-[250px] sm:min-h-[300px] py-4">
              {/* Placeholder chart - Gráfica de usuarios */}
              <div className="h-56 sm:h-64 w-full bg-gradient-to-b from-primary/30 to-transparent rounded-md flex items-end justify-around px-4 pb-4 gap-2">
                {[45, 65, 52, 78, 85, 70, 92].map((height, i) => (
                  <div key={i} className="flex-1 bg-primary/60 rounded-t" style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="flex justify-around mt-2 text-xs text-gray-500 dark:text-[#92b7c9]">
                {(t('dashboard.week_days', { returnObjects: true }) as string[]).map((day, i) => (
                  <span key={i}>{day}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick access */}
        <div>
          <h2 className="text-gray-900 dark:text-white text-lg sm:text-[22px] font-bold pb-3 pt-3 sm:pt-5">{t('dashboard.quick_access')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <a href="/exercises"
              className="flex flex-col items-center justify-center gap-2 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#1a2831] border border-gray-200 dark:border-[#325567] hover:border-primary dark:hover:border-primary transition-colors focus-visible:ring-2 ring-primary shadow-card-md">
              <span className="material-symbols-outlined text-primary text-3xl sm:text-4xl" aria-hidden>search</span>
              <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base text-center">{t('dashboard.explore_exercises')}</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}
