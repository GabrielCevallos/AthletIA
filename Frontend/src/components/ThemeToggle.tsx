import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button aria-label="Cambiar tema" onClick={toggle}
      className="rounded-full p-2 bg-white/10 dark:bg-white/10 hover:bg-white/20 text-white">
      <span className="material-symbols-outlined">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
    </button>
  )
}
