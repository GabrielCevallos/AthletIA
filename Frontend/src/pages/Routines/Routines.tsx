import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit, FileText } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import { deleteRoutine, getAllRoutines, Routine } from '../../lib/routineStore'

export default function Routines() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    setRoutines(getAllRoutines())
  }, [])

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar rutina?')) {
      deleteRoutine(id)
      setRoutines(getAllRoutines())
    }
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6">
      <header className="flex flex-wrap justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-white text-3xl font-black">Rutinas</h1>
          <p className="text-gray-300 text-sm">Administra tus rutinas guardadas.</p>
        </div>
        <Link to="/routines/new" className="flex items-center gap-2 bg-primary text-background-dark px-4 py-2 rounded-xl font-bold hover:bg-primary/90">
          <Plus size={20} /> Nueva rutina
        </Link>
      </header>

      {routines.length === 0 ? (
        <div className="bg-background-dark border border-white/10 rounded-xl p-6 text-gray-300 text-center">
          Aún no tienes rutinas. Crea la primera.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {routines.map((r) => (
            <div key={r.id} className="bg-background-dark border border-white/10 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <p className="text-white font-bold text-lg">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.exercises.length} ejercicios</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/routines/${r.id}/edit`)} className="p-2 hover:bg-white/10 rounded text-white" aria-label="Editar rutina">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="p-2 hover:bg-red-900/30 rounded text-red-400" aria-label="Eliminar rutina">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {r.exercises.slice(0, 3).map((ex) => (
                  <span key={ex.id} className="px-2 py-1 rounded-full bg-white/10 text-xs text-white border border-white/10">{ex.name}</span>
                ))}
                {r.exercises.length > 3 && <span className="text-gray-300 text-xs">+{r.exercises.length - 3} más</span>}
              </div>
              <div className="flex gap-2">
                <Link to={`/routines/${r.id}`} className="flex-1 inline-flex items-center justify-center gap-2 border border-white/10 rounded-lg py-2 text-white hover:bg-white/10">
                  <FileText size={16} /> Ver detalle
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </Layout>
  )
}
