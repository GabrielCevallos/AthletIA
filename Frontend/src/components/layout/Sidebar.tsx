import { NavLink } from 'react-router-dom'
import ThemeToggle from '../ThemeToggle'

export default function Sidebar() {
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive ? 'bg-[#233c48]' : 'hover:bg-[#233c48]/60'}`
  return (
    <aside className="w-64 bg-[#111c22] p-4 flex flex-col justify-between min-h-screen">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">fitness_center</span>
          <h1 className="text-white text-xl font-bold">AthletIA</h1>
        </div>
        <div className="flex flex-col gap-2">
          <NavLink to="/dashboard" className={linkCls} aria-label="Ir al dashboard">
            <span className="material-symbols-outlined text-white">dashboard</span>
            <p className="text-white text-sm font-medium">Dashboard</p>
          </NavLink>
          <NavLink to="/exercises" className={linkCls} aria-label="Ir a ejercicios">
            <span className="material-symbols-outlined text-white">exercise</span>
            <p className="text-white text-sm font-medium">Ejercicios</p>
          </NavLink>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <ThemeToggle />
      </div>
    </aside>
  )
}
