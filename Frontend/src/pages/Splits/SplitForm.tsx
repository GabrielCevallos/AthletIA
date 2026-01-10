import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import { getSplitById, upsertSplit, Days, Split } from '../../lib/splitStore'
import { getAllRoutines, Routine } from '../../lib/routineStore'
import { useAuth } from '../../context/AuthContext'
import Swal from 'sweetalert2'

const DAY_OPTIONS = [
  { label: 'Lunes', value: Days.MONDAY },
  { label: 'Martes', value: Days.TUESDAY },
  { label: 'Miércoles', value: Days.WEDNESDAY },
  { label: 'Jueves', value: Days.THURSDAY },
  { label: 'Viernes', value: Days.FRIDAY },
  { label: 'Sábado', value: Days.SATURDAY },
  { label: 'Domingo', value: Days.SUNDAY },
];

export default function SplitForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role } = useAuth()
  const isAdmin = role === 'ADMIN'
  
  console.log('🔑 SplitForm - Role:', role, 'isAdmin:', isAdmin)
  
  const [routines, setRoutines] = useState<Routine[]>([])
  const [form, setForm] = useState<Partial<Split>>({
    name: '',
    description: '',
    nTrainingDays: 0,
    nRestDays: 0,
    trainingDays: [],
    routineSchedule: {},
    official: isAdmin, // Marcar como oficial si es admin
  })

  useEffect(() => {
    // Cargar rutinas existentes
    setRoutines(getAllRoutines())

    if (id && id !== 'new') {
      const existing = getSplitById(id)
      if (existing) {
        setForm({
          ...existing,
          official: isAdmin ? true : existing.official, // Forzar oficial si es admin
        })
      }
    }
  }, [id, isAdmin])

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const toggleDay = (day: Days) => {
    setForm((prev) => {
      const days = prev.trainingDays || []
      const exists = days.includes(day)
      const newTrainingDays = exists ? (prev.nTrainingDays || 1) - 1 : (prev.nTrainingDays || 0) + 1
      const nextTrainingDays = exists ? days.filter((d) => d !== day) : [...days, day]
      const nextSchedule = { ...(prev.routineSchedule || {}) }
      if (exists) {
        // Al quitar el día, también eliminar la asignación de rutina
        delete nextSchedule[day]
      }
      return {
        ...prev,
        trainingDays: nextTrainingDays,
        nTrainingDays: newTrainingDays,
        nRestDays: 7 - newTrainingDays,
        routineSchedule: nextSchedule,
      }
    })
  }

  const assignRoutineToDay = (day: Days, routineId: string) => {
    setForm((prev) => ({
      ...prev,
      routineSchedule: {
        ...(prev.routineSchedule || {}),
        [day]: routineId || undefined,
      },
    }))
  }

  const handleSave = async () => {
    if (!form.name || !form.name.trim()) {
      await Swal.fire({
        title: 'Error',
        text: 'El nombre del split es requerido.',
        icon: 'error',
      })
      return
    }

    if ((form.trainingDays || []).length === 0) {
      await Swal.fire({
        title: 'Error',
        text: 'Selecciona al menos un día de entrenamiento.',
        icon: 'error',
      })
      return
    }

    const record = upsertSplit({
      id: form.id || '',
      name: form.name,
      description: form.description || '',
      nTrainingDays: form.nTrainingDays || 0,
      nRestDays: 7 - (form.nTrainingDays || 0),
      trainingDays: form.trainingDays || [],
      routineSchedule: form.routineSchedule || {},
      official: isAdmin ? true : (form.official || false), // Forzar oficial si es admin
      createdAt: form.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    await Swal.fire({
      title: 'Guardado',
      text: `Split "${record.name}" guardado correctamente.`,
      icon: 'success',
      timer: 1600,
      timerProgressBar: true,
      showConfirmButton: false,
    })

    navigate('/splits')
  }

  return (
    <Layout>
      <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm mb-2">
          <ArrowLeft size={18} /> Volver
        </button>

        <header className="flex flex-col gap-2">
          <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-black">
            {form.id ? 'Editar split' : 'Nuevo split'}
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            {form.id ? 'Actualiza los detalles de tu split.' : 'Crea un nuevo plan de entrenamiento.'}
          </p>
        </header>

        <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 sm:p-6 flex flex-col gap-4 shadow-card-md">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-900 dark:text-white text-sm">Nombre *</label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Push/Pull/Legs"
              className="px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-900 dark:text-white text-sm">Descripción</label>
            <textarea
              value={form.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe tu split..."
              rows={3}
              className="px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
            />
          </div>

          {/* Días de entrenamiento */}
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-gray-900 dark:text-white text-sm">Días de entrenamiento *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DAY_OPTIONS.map((day) => (
                <button
                  key={day.value}
                  onClick={() => toggleDay(day.value)}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    (form.trainingDays || []).includes(day.value)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Relacionar rutinas con días seleccionados */}
          {(form.trainingDays || []).length > 0 && (
            <div className="flex flex-col gap-3">
              <label className="font-semibold text-gray-900 dark:text-white text-sm">Asignar rutina por día</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(form.trainingDays || []).map((day) => (
                  <div key={day} className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{DAY_OPTIONS.find(d => d.value === day)?.label}</span>
                    <select
                      value={(form.routineSchedule || {})[day] || ''}
                      onChange={(e) => assignRoutineToDay(day, e.target.value)}
                      className="px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <option value="">Sin rutina</option>
                      {routines.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resumen */}
          <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Días de entrenamiento:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{form.nTrainingDays || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Días de descanso:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{form.nRestDays ?? 7}</span>
            </div>
          </div>

          {/* Botón guardar */}
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary mt-4"
          >
            <Save size={20} /> Guardar split
          </button>
        </div>
      </div>
    </Layout>
  )
}
