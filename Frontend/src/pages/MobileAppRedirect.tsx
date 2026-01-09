import { useState } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogOut, Smartphone, ShieldAlert } from 'lucide-react'

export default function MobileAppRedirect() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [requestSent, setRequestSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRequestModerator = async () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas solicitar el rol de moderador?\n\n' +
      'Esta es una acción seria. Debes tener contacto previo con los administradores para que esta solicitud sea aprobada. Si continúas, se enviará una solicitud oficial a los administradores.'
    )

    if (!confirmed) return

    setLoading(true)
    try {
      await api.post('users/request-moderator')
      setRequestSent(true)
      alert('Solicitud enviada correctamente. Los administradores revisarán tu petición.')
    } catch (error: any) {
      console.error(error)
      if (error.response?.data?.message) {
          alert('Error: ' + error.response.data.message)
      } else {
          alert('Ha ocurrido un error al procesar tu solicitud.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
      await logout()
      navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark p-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-[#1A2C35] rounded-xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-800 transition-colors duration-200">
        
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Acceso Restringido
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Esta plataforma web está diseñada exclusivamente para tareas de administración y moderación.
        </p>
        
        <div className="bg-sky-50 dark:bg-primary/5 border border-sky-100 dark:border-primary/10 p-5 rounded-lg mb-8 text-left">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Para usuarios y entrenadores
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Gestiona tus rutinas, splits y perfil desde nuestra aplicación móvil oficial.
              </p>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-primary hover:text-sky-600 transition-colors"
                onClick={(e) => {
                   if (e.currentTarget.getAttribute('href') === '#') {
                       e.preventDefault();
                       alert('Enlace a la app móvil pendiente de configuración.');
                   }
                }}
              >
                Descargar App para iOS/Android &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
           <button
             onClick={handleLogout}
             className="w-full py-2.5 px-4 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium flex items-center justify-center gap-2"
           >
             <LogOut className="w-4 h-4" />
             Cerrar Sesión
           </button>

          {!requestSent ? (
            <button
              onClick={handleRequestModerator}
              disabled={loading}
              className="text-xs text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
            >
              {loading ? 'Procesando...' : 'Solicitar acceso como Moderador'}
            </button>
          ) : (
            <p className="text-xs text-green-600 dark:text-green-400 animate-fade-in">
              ✓ Solicitud enviada a los administradores
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
