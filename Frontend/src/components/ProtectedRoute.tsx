import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { isAuthenticated, hasProfile, role } = useAuth()
  
  if (!isAuthenticated) return <Navigate to="/login" replace />

  // Mientras verificamos el perfil, mostramos carga para evitar "flash" del dashboard
  if (hasProfile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Si está autenticado pero no tiene perfil, redirigir a completar perfil
  if (hasProfile === false) {
    return <Navigate to="/complete-profile" replace state={{ message: 'Es necesario que completes tu perfil para acceder a todas las funcionalidades de la plataforma. No te tomará mucho tiempo.' }} />
  }

  // Verificación de rol: Solo Administradores y Moderadores tienen acceso a la app web
  if (role !== 'admin' && role !== 'moderator') {
    return <Navigate to="/mobile-app-redirect" replace />
  }

  return <Outlet />
}
