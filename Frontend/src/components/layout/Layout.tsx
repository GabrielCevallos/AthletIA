import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import NotificationsDropdown from './NotificationsDropdown'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden">
        <div className="flex items-center justify-end p-4 sm:p-6 lg:p-10 border-b border-gray-200 dark:border-[#325567]">
          <NotificationsDropdown />
        </div>
        <div className="p-4 sm:p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  )
}
