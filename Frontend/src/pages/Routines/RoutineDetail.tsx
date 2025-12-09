import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Trash2, Edit } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import { deleteRoutine, getRoutineById, Routine } from '../../lib/routineStore'

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

  const handleDelete = () => {
    if (!id) return
    if (confirm('¿Eliminar rutina?')) {
      deleteRoutine(id)
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

      <section className="bg-background-dark border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col gap-4">
        {routine.description && <p className="text-white/90 leading-relaxed">{routine.description}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {routine.exercises.map((ex) => (
            <div key={ex.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
              <p className="text-white font-bold">{ex.name}</p>
              <p className="text-gray-300 text-xs">{ex.muscle}</p>
              <div className="flex gap-3 text-xs text-white/90 mt-2">
                {ex.sets && <span>Series: {ex.sets}</span>}
                {ex.reps && <span>Reps: {ex.reps}</span>}
                {ex.rest && <span>Descanso: {ex.rest}</span>}
              </div>
              {ex.notes && <p className="text-[#92c9a4] text-xs mt-1">{ex.notes}</p>}
            </div>
          ))}
        </div>
      </section>
      </div>
    </Layout>
  )
}
