import axios from 'axios'

const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000',
  timeout: 30000, // 30 segundos timeout global
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
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('🔑 Token añadido al request:', token.substring(0, 20) + '...')
  } else {
    console.warn('⚠️ No hay token disponible para el request')
  }
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

// Exercise API functions
import { Exercise } from './exerciseStore';

export async function saveExercise(exercise: Exercise): Promise<Exercise> {
  try {
    console.log('📤 saveExercise llamado con exercise:', exercise);
    
    // Asegurar que muscleTarget y exerciseType sean arrays
    const muscleTargetArray = Array.isArray(exercise.muscleTarget) 
      ? exercise.muscleTarget 
      : exercise.muscleTarget 
        ? [exercise.muscleTarget] 
        : [];
    
    const exerciseTypeArray = Array.isArray(exercise.exerciseType)
      ? exercise.exerciseType
      : exercise.exerciseType
        ? [exercise.exerciseType]
        : [];

    if (muscleTargetArray.length === 0) {
      throw new Error('El ejercicio debe tener al menos un músculo objetivo');
    }

    if (exerciseTypeArray.length === 0) {
      throw new Error('El ejercicio debe tener al menos un tipo de ejercicio');
    }
    
    // Preparar los datos para el backend - solo los campos que espera el DTO
    const backendPayload = {
      name: exercise.name?.trim() || 'Sin nombre',
      description: (exercise.description?.trim() || 'Descripción del ejercicio sin especificar'),
      equipment: exercise.equipment,
      video: exercise.video || 'https://example.com/video',
      minSets: Number(exercise.minSets) || 3,
      maxSets: Number(exercise.maxSets) || 5,
      minReps: Number(exercise.minReps) || 8,
      maxReps: Number(exercise.maxReps) || 12,
      minRestTime: Number(exercise.minRestTime) || 60,
      maxRestTime: Number(exercise.maxRestTime) || 120,
      muscleTarget: muscleTargetArray,
      exerciseType: exerciseTypeArray,
      instructions: exercise.instructions || [],
      benefit: exercise.benefit || undefined,
      parentExerciseId: exercise.parentExerciseId || undefined,
    };

    console.log('📦 Payload preparado:', JSON.stringify(backendPayload, null, 2));

    if (!exercise.id || exercise.isSeed) {
      console.log('📨 Haciendo POST a /workout/exercises');
      console.log('🔑 Headers:', api.defaults.headers);
      const response = await api.post('/workout/exercises', backendPayload, {
        timeout: 30000, // 30 segundos timeout
      });
      // La respuesta es ResponseBody<Exercise> con estructura { success, message, data }
      console.log('✅ Response del POST:', response.data);
      return response.data?.data || response.data
    } else {
      // Si ya existe, hacer PATCH
      console.log(`📨 Haciendo PATCH a /workout/exercises/${exercise.id}`);
      const response = await api.patch(`/workout/exercises/${exercise.id}`, backendPayload, {
        timeout: 30000, // 30 segundos timeout
      })
      console.log('✅ Response del PATCH:', response.data);
      return response.data?.data || response.data
    }
  } catch (error: any) {
    console.error('❌ Error en saveExercise:', error);
    console.error('📋 Error completo:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    
    // Si hay un error de validación, mostrar detalles específicos
    if (error.response?.data?.message) {
      const validationErrors = error.response.data.message;
      if (Array.isArray(validationErrors)) {
        console.error('🔍 Errores de validación:', validationErrors);
      }
    }
    
    throw error
  }
}

export async function getExercise(id: string): Promise<Exercise> {
  try {
    const response = await api.get(`/workout/exercises/${id}`)
    return response.data.data || response.data
  } catch (error) {
    console.error('Error fetching exercise:', error)
    throw error
  }
}

export async function getAllExercises(): Promise<Exercise[]> {
  try {
    const response = await api.get('/workout/exercises')
    return response.data.data?.items || response.data.items || []
  } catch (error) {
    console.error('Error fetching exercises:', error)
    throw error
  }
}

export default api
