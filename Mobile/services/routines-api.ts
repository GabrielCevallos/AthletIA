import { Config } from '@/constants';

export class RoutinesApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code:
      | 'UNAUTHORIZED'
      | 'FORBIDDEN'
      | 'NOT_FOUND'
      | 'VALIDATION'
      | 'NETWORK_ERROR'
      | 'UNKNOWN'
  ) {
    super(message);
    this.name = 'RoutinesApiError';
  }
}

interface FetchOptions {
  token: string;
}

export type RoutineGoal =
  | 'weight_loss'
  | 'muscle_gain'
  | 'weight_maintenance'
  | 'endurance'
  | 'flexibility'
  | 'general_fitness'
  | 'rehabilitation'
  | 'improved_posture'
  | 'balance_and_coordination'
  | 'cardiovascular_health'
  | 'strength_training'
  | 'athletic_performance'
  | 'lifestyle_enhancement';

export type RoutineExercise = {
  id: string;
  name: string;
  description?: string;
};

export type Routine = {
  id: string;
  name: string;
  description: string;
  routineGoal: RoutineGoal[];
  official: boolean;
  nExercises?: number;
  exercises?: RoutineExercise[];
  exerciseIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
};

export type RoutineListResponse = {
  items: Routine[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type CreateRoutinePayload = {
  name: string;
  description: string;
  exerciseIds?: string[];
  routineGoal: RoutineGoal[];
  official: boolean;
};

export type UpdateRoutinePayload = Partial<CreateRoutinePayload>;

function buildError(status: number, message: string, code: RoutinesApiError['code']) {
  return new RoutinesApiError(status, message, code);
}

export async function fetchRoutines(
  options: FetchOptions & { limit?: number; offset?: number }
): Promise<RoutineListResponse> {
  const { token, limit, offset } = options;

  try {
    const url = new URL(`${Config.apiUrl}/workout/routines`);
    if (typeof limit === 'number') url.searchParams.set('limit', String(limit));
    if (typeof offset === 'number') url.searchParams.set('offset', String(offset));

    console.log('🚀 [routines-api] Iniciando fetchRoutines');
    console.log('📍 [routines-api] Config.apiUrl:', Config.apiUrl);
    console.log('📍 [routines-api] URL completa:', url.toString());
    console.log('🔑 [routines-api] Token presente:', token ? `Sí (${token.substring(0, 20)}...)` : 'No');
    console.log('📦 [routines-api] Parámetros - limit:', limit, 'offset:', offset);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 [routines-api] Respuesta recibida:');
    console.log('  - status:', response.status);
    console.log('  - statusText:', response.statusText);
    console.log('  - ok:', response.ok);
    console.log('  - headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

    if (response.status === 401) {
      throw buildError(401, 'Sesión expirada. Por favor, inicia sesión nuevamente.', 'UNAUTHORIZED');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [routines-api] Response no OK:', errorText);
      throw buildError(
        response.status,
        `Error al cargar rutinas: HTTP ${response.status}`,
        'UNKNOWN'
      );
    }

    const responseText = await response.text();
    console.log('📄 [routines-api] Texto de respuesta crudo:', responseText.substring(0, 500));
    
    const result = JSON.parse(responseText);
    
    console.log('🔍 [routines-api] Respuesta completa:', JSON.stringify(result, null, 2));
    console.log('🔍 [routines-api] result.success:', result?.success);
    console.log('🔍 [routines-api] result.data:', result?.data);
    console.log('🔍 [routines-api] result.data.items:', result?.data?.items);

    if (result?.success && result?.data?.items) {
      console.log('✅ [routines-api] Usando result.data (items encontrados)');
      return result.data;
    }

    if (Array.isArray(result?.data)) {
      console.log('✅ [routines-api] result.data es array, convirtiéndolo a { items: ... }');
      return { items: result.data };
    }

    if (Array.isArray(result)) {
      console.log('✅ [routines-api] result es array directo, convirtiéndolo a { items: ... }');
      return { items: result };
    }

    console.error('❌ [routines-api] Formato de respuesta inválido:', JSON.stringify(result).substring(0, 200));
    throw buildError(200, 'Formato de respuesta inválido', 'UNKNOWN');
  } catch (error) {
    if (error instanceof RoutinesApiError) {
      throw error;
    }

    console.error('Fetch routines error:', error);
    throw buildError(0, 'Error de conexión. Verifica tu conexión a internet.', 'NETWORK_ERROR');
  }
}

export async function fetchRoutineById(id: string, options: FetchOptions): Promise<Routine> {
  const { token } = options;

  try {
    const response = await fetch(`${Config.apiUrl}/workout/routines/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw buildError(401, 'Sesión expirada', 'UNAUTHORIZED');
    }

    if (response.status === 404) {
      throw buildError(404, 'Rutina no encontrada', 'NOT_FOUND');
    }

    if (!response.ok) {
      throw buildError(
        response.status,
        `Error al cargar la rutina: HTTP ${response.status}`,
        'UNKNOWN'
      );
    }

    const result = await response.json();

    if (!result?.success || !result?.data) {
      throw buildError(200, 'Formato de respuesta inválido', 'UNKNOWN');
    }

    return result.data;
  } catch (error) {
    if (error instanceof RoutinesApiError) {
      throw error;
    }

    console.error('Fetch routine by id error:', error);
    throw buildError(0, 'Error de conexión', 'NETWORK_ERROR');
  }
}

export async function createRoutine(
  payload: CreateRoutinePayload,
  options: FetchOptions
): Promise<Routine> {
  const { token } = options;

  try {
    const response = await fetch(`${Config.apiUrl}/workout/routines`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      throw buildError(401, 'Sesión expirada', 'UNAUTHORIZED');
    }

    if (response.status === 400) {
      throw buildError(400, 'Datos inválidos para crear la rutina', 'VALIDATION');
    }

    if (!response.ok) {
      throw buildError(
        response.status,
        `Error al crear rutina: HTTP ${response.status}`,
        'UNKNOWN'
      );
    }

    const result = await response.json();

    if (!result?.success || !result?.data) {
      throw buildError(200, 'Formato de respuesta inválido', 'UNKNOWN');
    }

    return result.data;
  } catch (error) {
    if (error instanceof RoutinesApiError) {
      throw error;
    }

    console.error('Create routine error:', error);
    throw buildError(0, 'Error de conexión', 'NETWORK_ERROR');
  }
}

export async function updateRoutine(
  id: string,
  payload: UpdateRoutinePayload,
  options: FetchOptions
): Promise<Routine> {
  const { token } = options;

  try {
    const response = await fetch(`${Config.apiUrl}/workout/routines/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      throw buildError(401, 'Sesión expirada', 'UNAUTHORIZED');
    }

    if (response.status === 403) {
      throw buildError(403, 'No tienes permiso para modificar esta rutina', 'FORBIDDEN');
    }

    if (response.status === 404) {
      throw buildError(404, 'Rutina no encontrada', 'NOT_FOUND');
    }

    if (response.status === 400) {
      throw buildError(400, 'Datos inválidos para actualizar la rutina', 'VALIDATION');
    }

    if (!response.ok) {
      throw buildError(
        response.status,
        `Error al actualizar rutina: HTTP ${response.status}`,
        'UNKNOWN'
      );
    }

    const result = await response.json();

    if (!result?.success || !result?.data) {
      throw buildError(200, 'Formato de respuesta inválido', 'UNKNOWN');
    }

    return result.data;
  } catch (error) {
    if (error instanceof RoutinesApiError) {
      throw error;
    }

    console.error('Update routine error:', error);
    throw buildError(0, 'Error de conexión', 'NETWORK_ERROR');
  }
}

export async function deleteRoutine(id: string, options: FetchOptions): Promise<void> {
  const { token } = options;

  try {
    const response = await fetch(`${Config.apiUrl}/workout/routines/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw buildError(401, 'Sesión expirada', 'UNAUTHORIZED');
    }

    if (response.status === 403) {
      throw buildError(403, 'No tienes permiso para eliminar esta rutina', 'FORBIDDEN');
    }

    if (response.status === 404) {
      throw buildError(404, 'Rutina no encontrada', 'NOT_FOUND');
    }

    if (!response.ok && response.status !== 204) {
      throw buildError(
        response.status,
        `Error al eliminar rutina: HTTP ${response.status}`,
        'UNKNOWN'
      );
    }
  } catch (error) {
    if (error instanceof RoutinesApiError) {
      throw error;
    }

    console.error('Delete routine error:', error);
    throw buildError(0, 'Error de conexión', 'NETWORK_ERROR');
  }
}
