import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Trash2, Edit, ExternalLink } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import { deleteRoutine, getRoutineById, Routine } from '../../lib/routineStore'
import Swal from 'sweetalert2'

export default function RoutineDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [routine, setRoutine] = useState<Routine | null>(null)

  useEffect(() => {
    if (!id) return
    const found = getRoutineById(id)
    if (!found) {
      setRoutine(null)
    } else {
      setRoutine(found)
    }
  }, [id])

  const handleDelete = async () => {
    if (!id) return
    const result = await Swal.fire({
      title: '¿Eliminar rutina?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar',
    })

    if (result.isConfirmed) {
      deleteRoutine(id)
      await Swal.fire({
        title: 'Rutina eliminada',
        icon: 'success',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      })
      navigate('/routines')
    }
  }

  if (!routine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-white text-xl">Rutina no encontrada</p>
        <Link to="/routines" className="text-[#13ec5b] hover:underline">Volver a rutinas</Link>
      </div>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/routines')} className="p-2 hover:bg-white/10 rounded-lg text-white" aria-label="Volver">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-white text-3xl font-black">{routine.name}</h1>
            <p className="text-gray-300 text-sm">{routine.exercises.length} ejercicios</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/routines/${routine.id}/edit`)} className="p-2 hover:bg-white/10 rounded text-white" aria-label="Editar">
            <Edit size={18} />
          </button>
          <button onClick={handleDelete} className="p-2 hover:bg-red-900/30 rounded text-red-400" aria-label="Eliminar">
            <Trash2 size={18} />
          </button>
        </div>
      </header>

      <section className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 sm:p-6 flex flex-col gap-4 shadow-card-md">
        {routine.description && <p className="text-gray-700 dark:text-white/90 leading-relaxed">{routine.description}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {routine.exercises.map((ex) => (
            <div key={ex.id} className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 dark:text-white font-bold">{ex.name}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-xs">{ex.muscle}</p>
                </div>
                {ex.uid && (
                  <Link
                    to={`/exercises/${ex.uid}`}
                    className="flex-shrink-0 p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                    title="Ver ejercicio"
                  >
                    <ExternalLink size={16} />
                  </Link>
                )}
              </div>
              <div className="flex gap-3 text-xs text-gray-700 dark:text-white/90">
                {ex.sets && <span>Series: {ex.sets}</span>}
                {ex.reps && <span>Reps: {ex.reps}</span>}
                {ex.rest && <span>Descanso: {ex.rest}</span>}
              </div>
              {ex.notes && <p className="text-[#92c9a4] text-xs">{ex.notes}</p>}
            </div>
          ))}
        </div>
      </section>
      </div>
    </Layout>
  )
}
