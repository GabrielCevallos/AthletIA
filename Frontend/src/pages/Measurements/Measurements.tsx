import { useEffect, useState } from 'react'
import { Save, TrendingUp } from 'lucide-react'
import Layout from '../../components/layout/Layout'
import Swal from 'sweetalert2'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type CheckTime = 'WEEKLY' | 'MONTHLY' | 'YEARLY';

interface Measurement {
  id: string
  weight: number
  height: number
  imc: number
  left_arm?: number
  right_arm?: number
  left_forearm?: number
  right_forearm?: number
  clavicular_width?: number
  neck_diameter?: number
  chest_size?: number
  back_width?: number
  hip_diameter?: number
  left_leg?: number
  right_leg?: number
  left_calve?: number
  right_calve?: number
  checkTime: CheckTime
  createdAt: Date
  updatedAt: Date
}

interface FormData {
  weight: number
  height: number
  left_arm?: number
  right_arm?: number
  left_forearm?: number
  right_forearm?: number
  clavicular_width?: number
  neck_diameter?: number
  chest_size?: number
  back_width?: number
  hip_diameter?: number
  left_leg?: number
  right_leg?: number
  left_calve?: number
  right_calve?: number
  checkTime: CheckTime
}

const CHECK_TIME_OPTIONS: CheckTime[] = ['WEEKLY', 'MONTHLY', 'YEARLY'];
const CHECK_TIME_LABELS: Record<string, string> = {
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensual',
  YEARLY: 'Anual'
};

export default function Measurements() {
  const [measurement, setMeasurement] = useState<Measurement | null>(null)
  const [formData, setFormData] = useState<FormData>({
    weight: 70,
    height: 175,
    checkTime: 'WEEKLY',
  })
  const [history, setHistory] = useState<Array<{ weight: number; height: number; imc: number; date: string }>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMeasurement()
  }, [])

  const fetchMeasurement = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/measurements/me', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.data) {
          const m = data.data
          setMeasurement(m)
          setFormData({
            weight: m.weight,
            height: m.height,
            checkTime: m.checkTime,
            left_arm: m.left_arm,
            right_arm: m.right_arm,
            left_forearm: m.left_forearm,
            right_forearm: m.right_forearm,
            clavicular_width: m.clavicular_width,
            neck_diameter: m.neck_diameter,
            chest_size: m.chest_size,
            back_width: m.back_width,
            hip_diameter: m.hip_diameter,
            left_leg: m.left_leg,
            right_leg: m.right_leg,
            left_calve: m.left_calve,
            right_calve: m.right_calve,
          })
          // Agregar a historial
          setHistory([
            {
              weight: m.weight,
              height: m.height,
              imc: m.imc,
              date: new Date(m.createdAt).toLocaleDateString('es-ES'),
            },
          ])
        }
      }
    } catch (error) {
      console.error('Error fetching measurement:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateIMC = (weight: number, height: number): number => {
    const heightInMeters = height >= 10 ? height / 100 : height
    if (heightInMeters <= 0) return 0
    const imc = weight / (heightInMeters * heightInMeters)
    return Math.round(imc * 100) / 100
  }

  const handleChange = (field: string, value: string | number) => {
    let numValue = typeof value === 'string' ? parseFloat(value) || 0 : value
    // Convertir números negativos a 0
    if (numValue < 0) numValue = 0
    setFormData((prev) => {
      const updated = { ...prev, [field]: numValue }
      // Actualizar historial en tiempo real para gráfica
      if (field === 'weight' || field === 'height') {
        const w = field === 'weight' ? numValue : prev.weight
        const h = field === 'height' ? numValue : prev.height
        const imc = calculateIMC(w, h)
        setHistory([
          {
            weight: w,
            height: h,
            imc,
            date: 'Actual',
          },
          ...history.slice(0, 10), // Mantener últimos 10 registros
        ])
      }
      return updated
    })
  }

  const handleSave = async () => {
    if (formData.weight <= 0 || formData.height <= 0) {
      await Swal.fire({
        title: 'Error',
        text: 'Peso y altura deben ser mayores a 0.',
        icon: 'error',
      })
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/measurements/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        setMeasurement(data.data)
        await Swal.fire({
          title: 'Guardado',
          text: 'Tus medidas han sido guardadas correctamente.',
          icon: 'success',
          timer: 1600,
          timerProgressBar: true,
          showConfirmButton: false,
        })
        // Actualizar historial con el nuevo registro
        setHistory([
          {
            weight: data.data.weight,
            height: data.data.height,
            imc: data.data.imc,
            date: new Date().toLocaleDateString('es-ES'),
          },
          ...history.filter((h) => h.date !== 'Actual'),
        ])
      }
    } catch (error) {
      console.error('Error saving measurement:', error)
      await Swal.fire({
        title: 'Error',
        text: 'No se pudieron guardar las medidas.',
        icon: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const imc = calculateIMC(formData.weight, formData.height)

  return (
    <Layout>
      <div className="flex flex-col gap-4 sm:gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl font-black">Mis Medidas</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            Registra y controla tu progreso físico.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Formulario */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 sm:p-6 flex flex-col gap-4 shadow-card-md">
              <h2 className="font-bold text-gray-900 dark:text-white">Medidas Básicas</h2>

              {/* Peso */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">Peso (kg) *</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  step="0.1"
                  className="px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              {/* Altura */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">Altura (cm) *</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  step="0.1"
                  className="px-3 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg bg-white dark:bg-background-dark text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              {/* IMC Display */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-200">IMC</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{imc}</span>
                </div>
              </div>

              {/* CheckTime */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">Momento del día</label>
                <div className="grid grid-cols-3 gap-2">
                  {CHECK_TIME_OPTIONS.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleChange('checkTime', time)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        formData.checkTime === time
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'
                      }`}
                    >
                      {CHECK_TIME_LABELS[time]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medidas Complementarias */}
              <details className="pt-4 border-t border-gray-200 dark:border-white/10">
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white text-sm hover:text-primary dark:hover:text-primary">
                  Más medidas (opcional)
                </summary>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {[
                    { key: 'left_arm', label: 'Brazo Izq.' },
                    { key: 'right_arm', label: 'Brazo Der.' },
                    { key: 'left_forearm', label: 'Antebrazo Izq.' },
                    { key: 'right_forearm', label: 'Antebrazo Der.' },
                    { key: 'clavicular_width', label: 'Clavicula' },
                    { key: 'neck_diameter', label: 'Cuello' },
                    { key: 'chest_size', label: 'Pecho' },
                    { key: 'back_width', label: 'Espalda' },
                    { key: 'hip_diameter', label: 'Cadera' },
                    { key: 'left_leg', label: 'Pierna Izq.' },
                    { key: 'right_leg', label: 'Pierna Der.' },
                    { key: 'left_calve', label: 'Pantorrilla Izq.' },
                    { key: 'right_calve', label: 'Pantorrilla Der.' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-900 dark:text-white">{label}</label>
                      <input
                        type="number"
                        value={formData[key as keyof FormData] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                        step="0.1"
                        placeholder="cm"
                        className="px-2 py-1.5 text-sm border border-gray-200 dark:border-white/10 rounded bg-white dark:bg-background-dark text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      />
                    </div>
                  ))}
                </div>
              </details>

              {/* Botón guardar */}
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                <Save size={20} /> {loading ? 'Guardando...' : 'Guardar medidas'}
              </button>
            </div>
          </div>

          {/* Gráfica */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-4 sm:p-6 shadow-card-md">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-primary" />
                <h2 className="font-bold text-gray-900 dark:text-white">Progreso</h2>
              </div>

              {history.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      yAxisId="left"
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px',
                      }}
                      formatter={(value: any) => value?.toFixed(2)}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="weight"
                      stroke="#3b82f6"
                      dot={{ r: 4 }}
                      name="Peso (kg)"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="height"
                      stroke="#10b981"
                      dot={{ r: 4 }}
                      name="Altura (cm)"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="imc"
                      stroke="#f59e0b"
                      dot={{ r: 4 }}
                      name="IMC"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  Sin datos para mostrar. Guarda tus primeras medidas.
                </div>
              )}
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { label: 'Peso', value: formData.weight, unit: 'kg' },
                { label: 'Altura', value: formData.height, unit: 'cm' },
                { label: 'IMC', value: imc, unit: '' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 rounded-xl p-3 sm:p-4 text-center shadow-card-md"
                >
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {item.label}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {item.value.toFixed(1)} {item.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
