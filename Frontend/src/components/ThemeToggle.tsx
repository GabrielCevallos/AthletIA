import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button 
      aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      onClick={toggle}
      className="rounded-full p-2 sm:p-3 bg-white dark:bg-[#1a2831] hover:bg-gray-100 dark:hover:bg-[#233c48] text-gray-900 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg border border-gray-200 dark:border-[#325567]"
      title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      <span className="material-symbols-outlined text-xl sm:text-2xl">
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}
