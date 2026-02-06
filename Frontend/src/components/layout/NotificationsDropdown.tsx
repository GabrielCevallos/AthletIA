import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import api from '../../lib/api'

type NotificationItem = {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt?: string
}

export default function NotificationsDropdown() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [markingId, setMarkingId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const formatDate = (value: string | null) => {
    if (!value) return t('dashboard.not_available')
    
    // Asegurar que la fecha se interprete como UTC si no tiene información de zona horaria
    const dateStr = value.includes('Z') || value.includes('+') || value.includes('-') && value.lastIndexOf('-') > 10
      ? value
      : value + 'Z'
    
    return new Intl.DateTimeFormat(i18n.language, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(dateStr))
  }

  const getTypeLabel = (type?: string): string => {
    const typeMap: Record<string, string> = {
      info: t('dashboard.notifications_type_info'),
      success: t('dashboard.notifications_type_success'),
      warning: t('dashboard.notifications_type_warning'),
      error: t('dashboard.notifications_type_error'),
    }
    return typeMap[type?.toLowerCase() || 'info'] || t('dashboard.notifications_type_info')
  }

  const getTypeBadgeClass = (type?: string) => {
    if (!type) return 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200'
    const classes: Record<string, string> = {
      info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200',
      success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
      warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
      error: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200',
    }
    return classes[type.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-200'
  }

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [notifRes, unreadRes] = await Promise.all([
          api.get('/Notifications', { params: { limit: 10, offset: 0 } }),
          api.get('/Notifications/unread-count'),
        ])

        const notifData = notifRes.data?.data || notifRes.data || {}
        const notifList = Array.isArray(notifData)
          ? notifData
          : notifData.items || notifData.data || []
        setNotifications(notifList)

        const unreadData = unreadRes.data?.data || unreadRes.data || {}
        setUnreadCount(typeof unreadData.count === 'number' ? unreadData.count : 0)
      } catch (error) {
        console.error('Error loading notifications:', error)
      }
    }

    if (isOpen) {
      loadNotifications()
      const interval = setInterval(loadNotifications, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isOpen])

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (markingId) return

    const target = notifications.find((item) => item.id === id)
    if (!target || target.isRead) return

    setMarkingId(id)
    try {
      await api.patch(`/Notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        )
      )
      setUnreadCount((prev) => Math.max(prev - 1, 0))
    } finally {
      setMarkingId(null)
    }
  }

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await api.patch('/Notifications/read-all')
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition"
        title={t('dashboard.notifications_title')}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 bg-white dark:bg-[#1a2831] rounded-lg shadow-lg border border-gray-200 dark:border-[#325567] overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#325567]">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {t('dashboard.notifications_title')}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {unreadCount} {t('dashboard.notifications_unread')}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-2 py-1 rounded text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition"
              >
                {t('dashboard.notifications_mark_all')}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-80">
            {loading ? (
              <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('common.loading')}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                {t('dashboard.notifications_empty')}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-[#325567]">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition ${
                      !item.isRead ? 'bg-blue-50 dark:bg-blue-500/10' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${getTypeBadgeClass(
                            item.type
                          )}`}
                        >
                          {getTypeLabel(item.type)}
                        </span>
                        {!item.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(item.createdAt || null)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                      {item.message}
                    </p>
                    {!item.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(item.id, e)}
                        disabled={markingId === item.id}
                        className="text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-50"
                      >
                        {markingId === item.id ? t('common.loading') : t('dashboard.notifications_mark_read')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
