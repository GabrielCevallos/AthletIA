import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000',
})

function getAccessToken() {
  return localStorage.getItem('accessToken') || ''
}
function getRefreshToken() {
  return localStorage.getItem('refreshToken') || ''
}

let isRefreshing = false
let pending: Array<(token: string) => void> = []

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pending.push((token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          })
        })
      }
      original._retry = true
      isRefreshing = true
      try {
        const r = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, { refreshToken: getRefreshToken() })
        const { accessToken, refreshToken } = r.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        original.headers.Authorization = `Bearer ${accessToken}`
        pending.forEach((cb) => cb(accessToken))
        pending = []
        return api(original)
      } catch (e) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

// Placeholder generator used en UI para prellenar descripciones
export async function generateExerciseDescription(name: string, muscle?: string, equipment?: string) {
  try {
    const token = getAccessToken()
    const response = await fetch(`${api.defaults.baseURL}/ai/generate-exercise`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, muscle, equipment }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.description || data.data?.description || generateFallbackDescription(name, muscle, equipment)
    }
    return generateFallbackDescription(name, muscle, equipment)
  } catch (error) {
    console.error('Error generating exercise description:', error)
    return generateFallbackDescription(name, muscle, equipment)
  }
}

function generateFallbackDescription(name: string, muscle?: string, equipment?: string): string {
  const templates: Record<string, string> = {
    pecho: `${name} es un ejercicio efectivo para trabajar el pectoral. Se realiza de forma controlada, enfocándose en la contracción muscular. Ideal para desarrollar fuerza y volumen en el área del pecho.`,
    espalda: `${name} es un movimiento clave para fortalecer la espalda. Permite trabajar los músculos dorsales de manera integral. Recomendado para mejorar postura y desarrollar espalda ancha.`,
    brazos: `${name} es perfecto para aislar y desarrollar los músculos del brazo. Se realiza con movimientos controlados para maximizar la tensión muscular. Excelente para ganancia de volumen.`,
    piernas: `${name} es un ejercicio fundamental para las piernas. Trabaja múltiples grupos musculares de la parte inferior. Ideal para construir fuerza y tamaño en las piernas.`,
    hombros: `${name} es un movimiento efectivo para trabajar los hombros. Permite desarrollar definición y volumen en el área del deltoides. Recomendado para mejorar la postura.`,
    abs: `${name} es un ejercicio excelente para trabajar el core y abdominales. Se centra en la contracción abdominal controlada. Ideal para definir y fortalecer el área central.`,
  }

  const key = (muscle || '').toLowerCase()
  const baseTemplate = Object.entries(templates).find(([k]) => key.includes(k))?.[1] || 
    `${name} es un ejercicio versátil que se puede realizar en el gimnasio o en casa. Permite trabajar diferentes grupos musculares según la forma de ejecución.`

  if (equipment && equipment !== 'No especificado') {
    return `${baseTemplate} Se realiza utilizando ${equipment.toLowerCase()}. Asegúrate de mantener una buena forma para maximizar los beneficios.`
  }
  
  return baseTemplate
}

export default api
