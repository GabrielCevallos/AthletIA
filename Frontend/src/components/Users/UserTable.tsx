import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

interface User {
  id: string
  email: string
  state: string
  role: string
  name?: string
  birthDate?: string | null
}

type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export const UserTable = () => {
  const { role: currentUserRole } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    fetchUsers(currentPage, itemsPerPage)
  }, [currentPage, itemsPerPage])

  async function fetchUsers(page: number, limit: number) {
    try {
      setLoading(true)
      const { data } = await api.get(`/users?offset=${page}&limit=${limit}`)
      console.log('✅ Usuarios cargados:', data)
      setUsers(data.items || [])
      setTotalUsers(data.total || 0)
      setError(null)
    } catch (err: any) {
      console.error('❌ Error cargando usuarios:', err)
      setError(err.response?.data?.message || 'Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handlePromoteToModerator = async (userId: string, userName?: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de otorgar permisos de moderador a ${userName || 'este usuario'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, otorgar permisos',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await api.patch(`/users/${userId}/give-role`, { role: 'moderator' })
        Swal.fire({
          title: '¡Permisos otorgados!',
          text: 'El usuario ahora es moderador.',
          icon: 'success'
        })
        fetchUsers(currentPage, itemsPerPage)
      } catch (error: any) {
        console.error('Error promoting user:', error)
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo actualizar el rol del usuario.',
          icon: 'error'
        })
      }
    }
  }

  const handleSuspendUser = async (userId: string, userName?: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres suspender a ${userName || 'este usuario'}? Perderá el acceso al sistema.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, suspender',
      cancelButtonText: 'Cancelar'
    })

    if (result.isConfirmed) {
      try {
        await api.patch(`/users/${userId}/suspend`)
        Swal.fire({
          title: '¡Suspendido!',
          text: 'El usuario ha sido suspendido.',
          icon: 'success'
        })
        fetchUsers(currentPage, itemsPerPage)
      } catch (error: any) {
        console.error('Error suspending user:', error)
        Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo suspender al usuario.',
          icon: 'error'
        })
      }
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

  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'INACTIVE':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusDotColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'ACTIVE':
        return 'bg-emerald-400';
      case 'INACTIVE':
        return 'bg-rose-400';
      case 'SUSPENDED':
        return 'bg-red-500';
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
          onClick={() => fetchUsers(currentPage, itemsPerPage)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Reintentar
        </button>
      </div>
    )
  }

  const totalPages = Math.ceil(totalUsers / itemsPerPage)

  return (
    <div className="w-full pb-32">
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
              <th scope="col" className="px-4 py-3">Usuario</th>
              <th scope="col" className="px-4 py-3">Rol</th>
              <th scope="col" className="px-4 py-3">Edad</th>
              <th scope="col" className="px-4 py-3">Estado</th>
              <th scope="col" className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#325567]">
            {filteredUsers.map((user) => (
              <tr 
                key={user.id} 
                className={`transition-colors group ${user.state?.toLowerCase() === 'suspended' ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
              >
                {/* User Info */}
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-gray-900 dark:text-white font-medium text-base flex items-center gap-2">
                      {user.name || 'Sin nombre'}
                      {user.state?.toLowerCase() === 'suspended' && (
                        <span className="material-symbols-outlined text-red-500 text-lg" title="Usuario Suspendido">block</span>
                      )}
                    </span>
                    <span className="text-gray-500 dark:text-[#64748b] text-xs mt-0.5 break-all">{user.email}</span>
                  </div>
                </td>

                {/* Role */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-primary">
                      {user.role === 'admin' || user.role === 'moderator' ? 'admin_panel_settings' : 'person'}
                    </span>
                    <span className="text-gray-900 dark:text-white capitalize">{user.role}</span>
                  </div>
                </td>

                {/* Age */}
                <td className="px-4 py-3 text-gray-900 dark:text-white">
                  {user.birthDate ? calculateAge(user.birthDate) || '-' : '-'}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border ${getStatusColor(user.state)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(user.state)}`}></span>
                    <span className="capitalize">{user.state}</span>
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <button 
                      className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-[#233c48] hover:bg-primary hover:text-white text-xs font-medium text-gray-700 dark:text-white transition-colors whitespace-nowrap"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      Ver Perfil
                    </button>
                    
                    {currentUserRole === 'admin' && user.role !== 'moderator' && (
                      <button 
                        className="px-3 py-1.5 rounded-md text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/5 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5 text-xs font-medium" 
                        title="Hacer Moderador"
                        onClick={() => handlePromoteToModerator(user.id, user.name)}
                      >
                        <span className="material-symbols-outlined text-base">verified_user</span>
                        <span className="hidden xl:inline">Hacer Mod</span>
                      </button>
                    )}

                    {(currentUserRole === 'admin' || currentUserRole === 'moderator') && (
                      <button 
                        className="px-3 py-1.5 rounded-md text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/5 hover:bg-amber-100 dark:hover:bg-amber-500/10 transition-colors flex items-center gap-1.5 text-xs font-medium" 
                        title="Suspender Usuario"
                        onClick={() => handleSuspendUser(user.id, user.name)}
                      >
                        <span className="material-symbols-outlined text-base">block</span>
                        <span className="hidden xl:inline">Suspender</span>
                      </button>
                    )}
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
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 border-t border-gray-200 dark:border-[#325567] pt-4 gap-4">
        {/* Limit Selector and Total Info */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-600 dark:text-[#92a4c9]">
          <div className="flex items-center gap-2">
            <span>Mostrar</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1) 
              }}
              className="pl-4 pr-10 py-1.5 rounded-lg border border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer text-sm"
            >
              {[10, 20, 50, 100].map(limit => (
                <option key={limit} value={limit}>{limit}</option>
              ))}
            </select>
            <span>por página</span>
          </div>
          
          <div className="hidden sm:block h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
          
          <p>
            Total: <span className="font-semibold text-gray-900 dark:text-white">{totalUsers}</span> usuarios
          </p>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2">
           <button
             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
             disabled={currentPage === 1 || loading}
             className="p-2 rounded-lg border border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#233c48] transition-all focus:ring-2 focus:ring-primary/20 active:scale-95"
             title="Página anterior"
           >
             <span className="material-symbols-outlined text-xl leading-none">chevron_left</span>
           </button>
           
           <div className="flex items-center gap-2 px-2">
             <span className="text-sm text-gray-600 dark:text-[#92a4c9]">Página</span>
             <select 
               value={currentPage}
               onChange={(e) => setCurrentPage(Number(e.target.value))}
               className="pl-4 pr-10 py-1.5 rounded-lg border border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm min-w-[5rem] text-center cursor-pointer"
             >
               {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(page => (
                 <option key={page} value={page}>{page}</option>
               ))}
             </select>
             <span className="text-sm text-gray-600 dark:text-[#92a4c9]">de <span className="font-medium text-gray-900 dark:text-white">{totalPages || 1}</span></span>
           </div>

           <button
             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
             disabled={currentPage >= totalPages || loading}
             className="p-2 rounded-lg border border-gray-300 dark:border-[#325567] bg-white dark:bg-[#1a2831] text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#233c48] transition-all focus:ring-2 focus:ring-primary/20 active:scale-95"
             title="Página siguiente"
           >
             <span className="material-symbols-outlined text-xl leading-none">chevron_right</span>
           </button>
        </div>
      </div>
    </div>
  )
}