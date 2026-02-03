import { Config } from '@/constants';
import type { Exercise } from '@/hooks/use-exercises';

/**
 * Servicio de API para ejercicios
 * Centraliza la lógica de comunicación con el backend
 */

export class ExercisesApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'ExercisesApiError';
  }
}

interface FetchOptions {
  token: string;
}

/**
 * Obtiene la lista de ejercicios con filtros opcionales
 */
export async function fetchExercises(
  options: FetchOptions & {
    category?: string;
  }
): Promise<Exercise[]> {
  const { token, category } = options;

  try {
    const url = new URL(`${Config.apiUrl}/workout/exercises`);
    if (category) {
      url.searchParams.append('category', category);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw new ExercisesApiError(
        401,
        'Sesión expirada. Por favor, inicia sesión nuevamente.',
        'UNAUTHORIZED'
      );
    }

    if (response.status === 403) {
      throw new ExercisesApiError(
        403,
        'No tienes permiso para acceder a esta sección.',
        'FORBIDDEN'
      );
    }

    if (!response.ok) {
      throw new ExercisesApiError(
        response.status,
        `Error al cargar ejercicios: HTTP ${response.status}`,
        'UNKNOWN'
      );
    }

    const result = await response.json();

    //console.log('API Response exercises-api.ts:', JSON.stringify(result, null, 2));

    // El backend puede retornar directamente un array o con estructura success
    if (Array.isArray(result)) {
      return result;
    } else if (result.success && Array.isArray(result.data)) {
      return result.data;
    } else if (result.data && Array.isArray(result.data)) {
      return result.data;
    } else {
      throw new ExercisesApiError(
        200,
        `Formato de respuesta inválido: ${JSON.stringify(result).substring(0, 100)}`,
        'UNKNOWN'
      );
    }
  } catch (error) {
    if (error instanceof ExercisesApiError) {
      throw error;
    }

    console.error('Fetch exercises error:', error);
    throw new ExercisesApiError(
      0,
      'Error de conexión. Verifica tu conexión a internet.',
      'NETWORK_ERROR'
    );
  }
}

/**
 * Obtiene los detalles de un ejercicio específico
 */
export async function fetchExerciseById(
  id: string,
  options: FetchOptions
): Promise<Exercise> {
  const { token } = options;

  try {
    const response = await fetch(
      `${Config.apiUrl}/workout/exercises/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 401) {
      throw new ExercisesApiError(
        401,
        'Sesión expirada',
        'UNAUTHORIZED'
      );
    }

    if (response.status === 403) {
      throw new ExercisesApiError(
        403,
        'No tienes permiso para acceder a este ejercicio',
        'FORBIDDEN'
      );
    }

    if (response.status === 404) {
      throw new ExercisesApiError(
        404,
        'Ejercicio no encontrado',
        'NOT_FOUND'
      );
    }

    if (!response.ok) {
      throw new ExercisesApiError(
        response.status,
        `Error al cargar el ejercicio: HTTP ${response.status}`,
        'UNKNOWN'
      );
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new ExercisesApiError(
        200,
        'Formato de respuesta inválido',
        'UNKNOWN'
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof ExercisesApiError) {
      throw error;
    }

    console.error('Fetch exercise by id error:', error);
    throw new ExercisesApiError(
      0,
      'Error de conexión',
      'NETWORK_ERROR'
    );
  }
}

/**
 * Guarda un ejercicio en la rutina del usuario
 */
export async function addExerciseToRoutine(
  exerciseId: string,
  routineId: string,
  options: FetchOptions
): Promise<void> {
  const { token } = options;

  try {
    const response = await fetch(
      `${Config.apiUrl}/routines/${routineId}/exercises`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
        }),
      }
    );

    if (response.status === 401) {
      throw new ExercisesApiError(401, 'Sesión expirada', 'UNAUTHORIZED');
    }

    if (response.status === 403) {
      throw new ExercisesApiError(
        403,
        'No tienes permiso para modificar esta rutina',
        'FORBIDDEN'
      );
    }

    if (!response.ok) {
      throw new ExercisesApiError(
        response.status,
        `Error al agregar ejercicio: HTTP ${response.status}`,
        'UNKNOWN'
      );
    }
  } catch (error) {
    if (error instanceof ExercisesApiError) {
      throw error;
    }

    console.error('Add exercise to routine error:', error);
    throw new ExercisesApiError(0, 'Error de conexión', 'NETWORK_ERROR');
  }
}
