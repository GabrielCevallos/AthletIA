import { useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { logout, name, role, accountId } = useAuth()
  const navigate = useNavigate()
  
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg ${
      isActive 
        ? 'bg-primary/20 dark:bg-[#233c48]' 
        : 'hover:bg-gray-200 dark:hover:bg-[#233c48]/60'
    } transition-colors`

  const closeSidebar = () => setIsOpen(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* Botón hamburguesa para móviles */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-[#111c22] text-gray-900 dark:text-white shadow-card-md hover:bg-gray-100 dark:hover:bg-[#233c48] focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200 dark:border-transparent"
        aria-label="Abrir menú de navegación"
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined text-2xl">
          {isOpen ? 'close' : 'menu'}
        </span>
      </button>

      {/* Backdrop para móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-white dark:bg-[#111c22] border-r border-gray-200 dark:border-transparent p-4 flex flex-col justify-between z-40 transition-transform duration-300 lg:translate-x-0 shadow-card-md ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-8 flex-1">
          {/* Logo */}
          <div className="flex items-center gap-3 pt-12 lg:pt-0">
            <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
            <h1 className="text-gray-900 dark:text-white text-xl font-bold">AthletIA</h1>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col gap-2" aria-label="Navegación principal">
            <NavLink 
              to="/dashboard" 
              className={linkCls} 
              aria-label="Ir al dashboard"
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-white">dashboard</span>
              <p className="text-gray-900 dark:text-white text-sm font-medium">Dashboard</p>
            </NavLink>
            <NavLink 
              to="/exercises" 
              className={linkCls} 
              aria-label="Ir a ejercicios"
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-white">exercise</span>
              <p className="text-gray-900 dark:text-white text-sm font-medium">Ejercicios</p>
            </NavLink>
            <NavLink 
              to="/routines" 
              className={linkCls} 
              aria-label="Ir a rutinas"
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-white">event_note</span>
              <p className="text-gray-900 dark:text-white text-sm font-medium">Rutinas</p>
            </NavLink>
            <NavLink 
              to="/splits" 
              className={linkCls} 
              aria-label="Ir a splits"
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-white">calendar_today</span>
              <p className="text-gray-900 dark:text-white text-sm font-medium">Splits</p>
            </NavLink>
            <NavLink 
              to="/measurements" 
              className={linkCls} 
              aria-label="Ir a medidas"
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-white">scale</span>
              <p className="text-gray-900 dark:text-white text-sm font-medium">Medidas</p>
            </NavLink>
            <NavLink 
              to="/users" 
              className={linkCls} 
              aria-label="Ir a usuarios"
              onClick={closeSidebar}
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-white">group</span>
              <p className="text-gray-900 dark:text-white text-sm font-medium">Usuarios</p>
            </NavLink>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
          <Link 
            to={accountId ? `/users/${accountId}` : '#'}
            className="mb-4 px-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-[#233c48]/60 p-2 rounded-lg transition-colors group"
            title="Ver mi perfil"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center text-primary dark:text-sky-200 shrink-0 group-hover:scale-105 transition-transform">
               <span className="font-bold">{(name || 'S').charAt(0).toUpperCase()}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary transition-colors">
                {name || 'Sin nombre'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                {role || 'Usuario'}
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Cerrar sesión"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
