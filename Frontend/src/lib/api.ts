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

export async function saveExercise(exercise: Exercise, isEditing: boolean = false): Promise<Exercise> {
  try {
    console.log('📤 saveExercise llamado con exercise:', exercise);
    console.log('📤 isEditing flag:', isEditing);
    
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
    const minSetsValue = Number(exercise.minSets) || 3;
    const maxSetsValue = Number(exercise.maxSets) || 5;
    const minRepsValue = Number(exercise.minReps) || 8;
    const maxRepsValue = Number(exercise.maxReps) || 12;
    const minRestTimeValue = Number(exercise.minRestTime) || 60;
    const maxRestTimeValue = Number(exercise.maxRestTime) || 120;

    // Validar que los números sean válidos
    if (isNaN(minSetsValue) || minSetsValue < 1) throw new Error('minSets debe ser un número >= 1');
    if (isNaN(maxSetsValue) || maxSetsValue < 1) throw new Error('maxSets debe ser un número >= 1');
    if (isNaN(minRepsValue) || minRepsValue < 1) throw new Error('minReps debe ser un número >= 1');
    if (isNaN(maxRepsValue) || maxRepsValue < 1) throw new Error('maxReps debe ser un número >= 1');
    if (isNaN(minRestTimeValue) || minRestTimeValue < 10) throw new Error('minRestTime debe ser un número >= 10');
    if (isNaN(maxRestTimeValue) || maxRestTimeValue < 1) throw new Error('maxRestTime debe ser un número >= 1');

    const backendPayload = {
      name: exercise.name?.trim() || 'Sin nombre',
      description: (exercise.description?.trim() || 'Descripción del ejercicio sin especificar') || 'Descripción del ejercicio sin especificar',
      equipment: exercise.equipment,
      video: exercise.video?.trim() || 'https://example.com/video',
      minSets: minSetsValue,
      maxSets: maxSetsValue,
      minReps: minRepsValue,
      maxReps: maxRepsValue,
      minRestTime: minRestTimeValue,
      maxRestTime: maxRestTimeValue,
      muscleTarget: muscleTargetArray,
      exerciseType: exerciseTypeArray,
      instructions: exercise.instructions || [],
      benefit: exercise.benefit || undefined,
      parentExerciseId: exercise.parentExerciseId || undefined,
    };

    // Validar que la descripción tenga al menos 10 caracteres
    if (backendPayload.description.length < 10) {
      throw new Error('La descripción debe tener al menos 10 caracteres');
    }

    // Validar que el video sea una URL válida
    try {
      new URL(backendPayload.video);
    } catch {
      throw new Error('El video debe ser una URL válida');
    }

    console.log('📦 Payload preparado:', JSON.stringify(backendPayload, null, 2));
    
    // IMPORTANTE: Validar que NO hay campos undefined en el payload
    const undefinedFields = Object.entries(backendPayload)
      .filter(([_, value]) => value === undefined)
      .map(([key]) => key);
    
    if (undefinedFields.length > 0) {
      console.warn('⚠️ Campos undefined encontrados:', undefinedFields);
      console.warn('⚠️ Estos campos serán eliminados del payload');
      undefinedFields.forEach(field => {
        delete (backendPayload as any)[field];
      });
    }

    console.log('📦 Payload final:', JSON.stringify(backendPayload, null, 2));

    // IMPORTANTE: Para nuevos ejercicios, siempre hacer POST
    // Para ediciones existentes, hacer PATCH
    // Usar el flag isEditing que viene desde CreateExercise para determinar si es edición
    // Un ejercicio es "nuevo" si:
    // 1. isEditing es false (no estamos editando)
    // 2. Es un duplicado de seed exercise (isSeed = true)
    
    const isCreatingNewExercise = !isEditing || exercise.isSeed;
    console.log('🔍 isCreatingNewExercise:', isCreatingNewExercise, '(isEditing:', isEditing, ', isSeed:', exercise.isSeed, ')');
    
    if (isCreatingNewExercise) {
      console.log('📨 Haciendo POST a /workout/exercises (nuevo ejercicio)');
      console.log('🔑 Headers:', api.defaults.headers);
      const response = await api.post('/workout/exercises', backendPayload, {
        timeout: 30000, // 30 segundos timeout
      });
      // La respuesta es ResponseBody<Exercise> con estructura { success, message, data }
      // axios envuelve la respuesta en response.data
      console.log('✅ Response del POST:', response.data);
      const result = response.data?.data || response.data;
      if (!result) {
        throw new Error('No se recibió respuesta válida del servidor');
      }
      return result;
    } else {
      // Si ya existe y viene de una edición (ID fue cargado desde el servidor)
      console.log(`📨 Haciendo PATCH a /workout/exercises/${exercise.id} (actualizar ejercicio existente)`);
      const response = await api.patch(`/workout/exercises/${exercise.id}`, backendPayload, {
        timeout: 30000, // 30 segundos timeout
      })
      console.log('✅ Response del PATCH:', response.data);
      const result = response.data?.data || response.data;
      if (!result) {
        throw new Error('No se recibió respuesta válida del servidor');
      }
      return result;
    }
  } catch (error: any) {
    console.error('❌ Error en saveExercise:', error);
    console.error('📋 Error completo:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: error.config,
    });
    
    // Si hay un error de validación, mostrar detalles específicos
    if (error.response?.data?.message) {
      const validationErrors = error.response.data.message;
      if (Array.isArray(validationErrors)) {
        console.error('🔍 Errores de validación:', validationErrors);
      }
    }
    
    // Mejorar el mensaje de error para timeouts
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      error.message = 'Timeout: El servidor tardó demasiado en responder. Verifica que el backend está en ejecución.';
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
