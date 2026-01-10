import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import ThemeToggle from '../ThemeToggle'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-10 w-full overflow-x-hidden">
        {children}
      </main>
      
      {/* Botón flotante de cambio de tema */}
      <div className="fixed top-6 right-6 z-40">
        <ThemeToggle />
      </div>
    </div>
  )
}
