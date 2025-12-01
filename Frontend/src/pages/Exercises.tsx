import { useEffect, useState } from 'react'
import api from '../lib/api'
import Layout from '../components/layout/Layout'

type Exercise = { id: string; name: string; description?: string; muscleTarget?: string }

export default function Exercises() {
  const [items, setItems] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/workout/exercises')
        setItems(data.data || [])
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Error al cargar ejercicios')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <Layout>
      <h1 className="text-gray-900 dark:text-white text-2xl font-bold mb-4">Ejercicios</h1>
      {loading && <p className="text-gray-500 dark:text-[#92b7c9]">Cargando...</p>}
      {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
      {!loading && items.length === 0 && <p className="text-gray-500 dark:text-[#92b7c9]">No hay ejercicios disponibles.</p>}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((e) => (
            <div key={e.id} className="rounded-xl border border-gray-200 dark:border-[#325567] bg-white dark:bg-[#1a2831] p-4">
              <p className="text-gray-900 dark:text-white font-semibold">{e.name}</p>
              {e.description && <p className="text-sm text-gray-500 dark:text-[#92b7c9]">{e.description}</p>}
              {e.muscleTarget && <span className="inline-block mt-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded">{e.muscleTarget}</span>}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
