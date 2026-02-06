import { useTheme } from './ThemeProvider'
import { useTranslation } from 'react-i18next'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const { t } = useTranslation()

  const label = theme === 'dark' ? t('settings.theme_toggle_light') : t('settings.theme_toggle_dark')
  const buttonText = theme === 'dark' ? t('settings.theme_light') : t('settings.theme_dark')

  return (
    <button 
      aria-label={label}
      onClick={toggle}
      className="rounded-lg px-3 py-2 bg-gray-100 dark:bg-[#233c48] hover:bg-gray-200 dark:hover:bg-[#2d4a5a] text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium flex items-center gap-2"
      title={label}
    >
      <span className="material-symbols-outlined text-lg">
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
      {buttonText}
    </button>
  )
}
