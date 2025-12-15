import { useState, useEffect } from 'react'
import api from '../../lib/api'

interface User {
  id: string
  email: string
  status: string
  role: string
  name?: string
  birthDate?: string | null
}

type UserStatus = 'Active' | 'Inactive' | 'Suspended'

export const UserTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      setLoading(true)
      const { data } = await api.get('/users')
      console.log('✅ Usuarios cargados:', data)
      setUsers(data.data || [])
      setError(null)
    } catch (err: any) {
      console.error('❌ Error cargando usuarios:', err)
      setError(err.response?.data?.message || 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const calculateAge = (birthDate: string | null | undefined): number | null => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Inactive':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Suspended':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusDotColor = (status: UserStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-400';
      case 'Inactive':
        return 'bg-rose-400';
      case 'Suspended':
        return 'bg-amber-400';
      default:
        return 'bg-gray-400';
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Controls: Search & Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="w-full md:w-96">
          <div className="flex items-center rounded-lg h-10 bg-white dark:bg-[#1a2831] border border-gray-200 dark:border-[#325567] focus-within:border-primary transition-colors">
            <div className="text-gray-500 dark:text-[#92b7c9] flex items-center justify-center pl-3 pr-2">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              className="flex w-full flex-1 bg-transparent border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#64748b] px-2 text-sm focus:ring-0 focus:outline-none"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="w-full overflow-hidden rounded-xl border border-gray-200 dark:border-[#325567] bg-white dark:bg-[#1a2831] shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-[#92b7c9]">
          <thead className="bg-gray-50 dark:bg-[#0d1419] text-xs uppercase font-semibold text-gray-700 dark:text-white border-b border-gray-200 dark:border-[#325567]">
            <tr>
              <th scope="col" className="px-6 py-4 whitespace-nowrap">Usuario</th>
              <th scope="col" className="px-6 py-4 whitespace-nowrap">Rol</th>
              <th scope="col" className="px-6 py-4 whitespace-nowrap">Edad</th>
              <th scope="col" className="px-6 py-4 whitespace-nowrap">Estado</th>
              <th scope="col" className="px-6 py-4 text-right whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#325567]">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                {/* User Info */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-gray-900 dark:text-white font-medium text-base">
                      {user.name || 'Sin nombre'}
                    </span>
                    <span className="text-gray-500 dark:text-[#64748b] text-xs mt-0.5">{user.email}</span>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-primary">
                      {user.role === 'admin' || user.role === 'moderator' ? 'admin_panel_settings' : 'person'}
                    </span>
                    <span className="text-gray-900 dark:text-white capitalize">{user.role}</span>
                  </div>
                </td>

                {/* Age */}
                <td className="px-6 py-4 text-gray-900 dark:text-white">
                  {user.birthDate ? calculateAge(user.birthDate) || '-' : '-'}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${getStatusColor(user.status as UserStatus)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(user.status as UserStatus)}`}></span>
                    {user.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button 
                      className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-[#233c48] hover:bg-primary hover:text-white text-xs font-medium text-gray-700 dark:text-white transition-colors whitespace-nowrap"
                      onClick={() => console.log('Ver perfil:', user.id)}
                    >
                      Ver Perfil
                    </button>
                    <button 
                      className="px-3 py-1.5 rounded-md text-gray-600 dark:text-[#92a4c9] bg-gray-100 dark:bg-[#233c48]/50 hover:bg-gray-200 dark:hover:bg-[#233c48] hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium" 
                      title="Editar"
                      onClick={() => console.log('Editar:', user.id)}
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                      <span className="hidden xl:inline">Editar</span>
                    </button>
                    <button 
                      className="px-3 py-1.5 rounded-md text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors flex items-center gap-1.5 text-xs font-medium" 
                      title="Eliminar"
                      onClick={() => console.log('Eliminar:', user.id)}
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                      <span className="hidden xl:inline">Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-[#92a4c9]">
                  {searchTerm ? `No se encontraron usuarios con "${searchTerm}"` : 'No hay usuarios disponibles'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 gap-4">
        <p className="text-sm text-gray-600 dark:text-[#92a4c9]">
          Mostrando <span className="font-medium text-gray-900 dark:text-white">{filteredUsers.length}</span> de <span className="font-medium text-gray-900 dark:text-white">{users.length}</span> usuarios
        </p>
      </div>
    </div>
  )
}