import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import ThemeToggle from '../ThemeToggle'
import LanguageSelector from '../LanguageSelector'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-y-auto overflow-x-hidden">
        {children}
      </main>
      
      {/* Botón flotante de cambio de tema - responsivo */}
      <div className="fixed bottom-6 left-6 z-40 lg:left-[280px] flex gap-4 items-center">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  )
}
