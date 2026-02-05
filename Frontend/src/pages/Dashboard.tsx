import { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import { useTranslation } from 'react-i18next'
import api from '../lib/api'

type DashboardStats = {
  totalUsers: number | null
  newUsersLast7: number | null
  moderatorsCount: number | null
  adminsCount: number | null
  suspendedCount: number | null
  exercisesTotal: number | null
  routinesTotal: number | null
  splitsTotal: number | null
  officialRatio: number | null
  unreadNotifications: number | null
  criticalNotifications: number | null
  lastNotificationAt: string | null
}

const initialStats: DashboardStats = {
  totalUsers: null,
  newUsersLast7: null,
  moderatorsCount: null,
  adminsCount: null,
  suspendedCount: null,
  exercisesTotal: null,
  routinesTotal: null,
  splitsTotal: null,
  officialRatio: null,
  unreadNotifications: null,
  criticalNotifications: null,
  lastNotificationAt: null,
}

type ListResult<T> = {
  items: T[]
  total: number
}

function normalizeListResponse<T = any>(response: any): ListResult<T> {
  const payload = response?.data?.data ?? response?.data ?? {}

  if (Array.isArray(payload)) {
    return { items: payload, total: payload.length }
  }

  if (Array.isArray(payload.items)) {
    return {
      items: payload.items,
      total: typeof payload.total === 'number' ? payload.total : payload.items.length,
    }
  }

  if (Array.isArray(payload.data)) {
    return { items: payload.data, total: payload.data.length }
  }

  return { items: [], total: 0 }
}

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const [stats, setStats] = useState<DashboardStats>(initialStats)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const loadStats = async () => {
      setIsLoading(true)

      const results = await Promise.allSettled([
        api.get('/users', { params: { limit: 1000, offset: 0 } }),
        api.get('/workout/exercises', { params: { limit: 1000, offset: 0 } }),
        api.get('/workout/routines', { params: { limit: 1000, offset: 0 } }),
        api.get('/workout/splits', { params: { limit: 1000, offset: 0 } }),
        api.get('/Notifications', { params: { limit: 20, offset: 0 } }),
        api.get('/Notifications/unread-count'),
      ])

      if (!active) return

      const [
        usersRes,
        exercisesRes,
        routinesRes,
        splitsRes,
        notificationsRes,
        unreadRes,
      ] = results

      const nextStats: DashboardStats = { ...initialStats }

      if (usersRes.status === 'fulfilled') {
        const { items, total } = normalizeListResponse<any>(usersRes.value)
        nextStats.totalUsers = total

        if (items.length === total) {
          nextStats.moderatorsCount = items.filter((user) => user.role === 'moderator').length
          nextStats.adminsCount = items.filter((user) => user.role === 'admin').length
          nextStats.suspendedCount = items.filter((user) => user.state === 'SUSPENDED').length
        }
      }

      if (exercisesRes.status === 'fulfilled') {
        const { items, total } = normalizeListResponse<any>(exercisesRes.value)
        nextStats.exercisesTotal = total
        if (items.length === total) {
          const official = items.filter((item) => item.official).length
          nextStats.officialRatio = total > 0 ? official / total : 0
        }
      }

      if (routinesRes.status === 'fulfilled') {
        const { items, total } = normalizeListResponse<any>(routinesRes.value)
        nextStats.routinesTotal = total
        if (items.length === total && nextStats.officialRatio !== null) {
          const official = items.filter((item) => item.official).length
          const currentTotal = nextStats.exercisesTotal ?? 0
          const combinedTotal = currentTotal + total
          const combinedOfficial = Math.round((nextStats.officialRatio || 0) * currentTotal) + official
          nextStats.officialRatio = combinedTotal > 0 ? combinedOfficial / combinedTotal : 0
        } else {
          nextStats.officialRatio = null
        }
      }

      if (splitsRes.status === 'fulfilled') {
        const { items, total } = normalizeListResponse<any>(splitsRes.value)
        nextStats.splitsTotal = total
        if (items.length === total && nextStats.officialRatio !== null) {
          const official = items.filter((item) => item.official).length
          const currentTotal =
            (nextStats.exercisesTotal ?? 0) + (nextStats.routinesTotal ?? 0)
          const combinedTotal = currentTotal + total
          const combinedOfficial =
            Math.round((nextStats.officialRatio || 0) * currentTotal) + official
          nextStats.officialRatio = combinedTotal > 0 ? combinedOfficial / combinedTotal : 0
        } else {
          nextStats.officialRatio = null
        }
      }

      if (notificationsRes.status === 'fulfilled') {
        const { items } = normalizeListResponse<any>(notificationsRes.value)

        const criticalTypes = new Set(['error', 'critical', 'warning'])
        nextStats.criticalNotifications = items.filter((item) => criticalTypes.has(item.type)).length

        const lastEvent = items
          .filter((item) => item.createdAt)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0]
        nextStats.lastNotificationAt = lastEvent?.createdAt || null
      }

      if (unreadRes.status === 'fulfilled') {
        const payload = unreadRes.value?.data?.data ?? unreadRes.value?.data ?? {}
        const count = typeof payload.count === 'number' ? payload.count : null
        nextStats.unreadNotifications = count
      }

      setStats(nextStats)
      setIsLoading(false)
    }

    loadStats()

    return () => {
      active = false
    }
  }, [])

  const typeBadgeClasses: Record<string, string> = {
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
    error: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200',
  }

  const formatNumber = (value: number | null) =>
    value === null ? t('dashboard.not_available') : value.toLocaleString(i18n.language)

  const formatPercent = (value: number | null) =>
    value === null
      ? t('dashboard.not_available')
      : `${Math.round(value * 100)}%`

  const formatDate = (value: string | null) =>
    value
      ? new Intl.DateTimeFormat(i18n.language, {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(value))
      : t('dashboard.not_available')

  const getTypeBadgeClass = (type?: string) => {
    if (!type) return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200'
    return typeBadgeClasses[type.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200'
  }

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
                <p className="text-gray-900 dark:text-white text-2xl sm:text-[32px] font-bold mt-2">
                  {isLoading ? t('common.loading') : formatNumber(stats.totalUsers)}
                </p>
              </div>
              <div className="flex gap-1 items-center">
                <p className="text-gray-500 dark:text-[#92b7c9] text-xs sm:text-sm">{t('dashboard.last_7_days')}</p>
                <p className="text-[#0bda57] text-xs sm:text-sm font-medium">
                  {isLoading
                    ? t('common.loading')
                    : stats.newUsersLast7 === null
                      ? t('dashboard.not_available')
                      : `+${stats.newUsersLast7} ${t('dashboard.new_users')}`}
                </p>
              </div>
            </div>
            <div className="min-h-[250px] sm:min-h-[300px] py-4">
              <div className="h-56 sm:h-64 w-full bg-gradient-to-b from-primary/30 to-transparent rounded-md flex items-center justify-center px-4">
                <span className="text-sm text-gray-500 dark:text-[#92b7c9]">
                  {isLoading ? t('common.loading') : t('dashboard.weekly_no_data')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-[#325567] bg-white dark:bg-[#1a2831] p-4 sm:p-6 shadow-card-md">
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-gray-900 dark:text-white text-base sm:text-lg font-bold">
                {t('dashboard.moderation_title')}
              </p>
              <a
                href="/users"
                className="text-xs sm:text-sm text-primary hover:text-primary/80 font-medium"
              >
                {t('dashboard.view_users')}
              </a>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span>{t('dashboard.moderation_pending')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isLoading ? t('common.loading') : formatNumber(stats.moderatorsCount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span>{t('dashboard.moderation_role_changes')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isLoading ? t('common.loading') : formatNumber(stats.adminsCount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span>{t('dashboard.moderation_suspended')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isLoading ? t('common.loading') : formatNumber(stats.suspendedCount)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-[#325567] bg-white dark:bg-[#1a2831] p-4 sm:p-6 shadow-card-md">
            <p className="text-gray-900 dark:text-white text-base sm:text-lg font-bold mb-3">
              {t('dashboard.content_title')}
            </p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border border-gray-200 dark:border-white/10 p-3">
                <p className="text-gray-500 dark:text-gray-300 text-xs">{t('dashboard.content_exercises')}</p>
                <p className="text-gray-900 dark:text-white font-bold text-lg">
                  {isLoading ? t('common.loading') : formatNumber(stats.exercisesTotal)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-white/10 p-3">
                <p className="text-gray-500 dark:text-gray-300 text-xs">{t('dashboard.content_routines')}</p>
                <p className="text-gray-900 dark:text-white font-bold text-lg">
                  {isLoading ? t('common.loading') : formatNumber(stats.routinesTotal)}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 dark:border-white/10 p-3">
                <p className="text-gray-500 dark:text-gray-300 text-xs">{t('dashboard.content_splits')}</p>
                <p className="text-gray-900 dark:text-white font-bold text-lg">
                  {isLoading ? t('common.loading') : formatNumber(stats.splitsTotal)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-[#325567] bg-white dark:bg-[#1a2831] p-4 sm:p-6 shadow-card-md">
            <p className="text-gray-900 dark:text-white text-base sm:text-lg font-bold mb-3">
              {t('dashboard.notifications_title')}
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span>{t('dashboard.notifications_unread')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isLoading ? t('common.loading') : formatNumber(stats.unreadNotifications)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span>{t('dashboard.notifications_critical')}</span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  {isLoading ? t('common.loading') : formatNumber(stats.criticalNotifications)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span>{t('dashboard.notifications_last_event')}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {isLoading ? t('common.loading') : formatDate(stats.lastNotificationAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
