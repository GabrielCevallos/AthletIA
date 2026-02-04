import Layout from '../components/layout/Layout'
import { UserTable } from '../components/Users/UserTable'
import { useTranslation } from 'react-i18next'

export default function UserManagement() {
  const { t } = useTranslation()
  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 sm:mb-8">
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <p className="text-gray-900 dark:text-white text-3xl sm:text-4xl font-black tracking-[-0.033em]">
              {t('users.title')}
            </p>
            <p className="text-gray-500 dark:text-[#92b7c9] text-sm sm:text-base">
              {t('users.subtitle')}
            </p>
          </div>
        </div>

        <UserTable />
      </div>
    </Layout>
  )
}