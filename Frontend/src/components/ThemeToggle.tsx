import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button 
      aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      onClick={toggle}
      className="rounded-lg px-3 py-2 bg-gray-100 dark:bg-[#233c48] hover:bg-gray-200 dark:hover:bg-[#2d4a5a] text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium flex items-center gap-2"
      title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      <span className="material-symbols-outlined text-lg">
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
      {theme === 'dark' ? 'Claro' : 'Oscuro'}
    </button>
  )
}
