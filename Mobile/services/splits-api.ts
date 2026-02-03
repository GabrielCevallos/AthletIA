import { Config } from '@/constants';

export class SplitsApiError extends Error {
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
    this.name = 'SplitsApiError';
  }
}

interface FetchOptions {
  token: string;
}

export type TrainingDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type Split = {
  id: string;
  name: string;
  description: string;
  trainingDays: TrainingDay[];
  routineIds?: string[];
  routines?: Array<{
    id: string;
    name: string;
  }>;
  official: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
};

export type SplitListResponse = {
  items: Split[];
  total?: number;
  limit?: number;
  offset?: number;
};

export type CreateSplitPayload = {
  name: string;
  description: string;
  trainingDays: TrainingDay[];
  routineIds?: string[];
  official: boolean;
};

export type UpdateSplitPayload = Partial<CreateSplitPayload>;

function buildError(status: number, message: string, code: SplitsApiError['code']) {
  return new SplitsApiError(status, message, code);
}

export async function fetchSplits(
  options: FetchOptions & { limit?: number; offset?: number }
): Promise<SplitListResponse> {
  const { token, limit, offset } = options;

  try {
    const url = new URL(`${Config.apiUrl}/workout/splits`);
    if (typeof limit === 'number') url.searchParams.set('limit', String(limit));
    if (typeof offset === 'number') url.searchParams.set('offset', String(offset));

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw buildError(401, 'Sesión expirada. Por favor, inicia sesión nuevamente.', 'UNAUTHORIZED');
    }

    const json = await response.json();

    if (!response.ok) {
      throw buildError(response.status, json.message || 'Error al obtener los splits', 'UNKNOWN');
    }

    return json.data || { items: [], total: 0, limit: limit || 10, offset: offset || 0 };
  } catch (error) {
    if (error instanceof SplitsApiError) {
      throw error;
    }
    throw buildError(0, 'Error de red al conectar con el servidor', 'NETWORK_ERROR');
  }
}

export async function fetchSplitById(
  splitId: string,
  options: FetchOptions
): Promise<Split> {
  const { token } = options;

  try {
    const response = await fetch(`${Config.apiUrl}/workout/splits/${splitId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw buildError(401, 'Sesión expirada. Por favor, inicia sesión nuevamente.', 'UNAUTHORIZED');
    }

    if (response.status === 404) {
      throw buildError(404, 'Split no encontrado', 'NOT_FOUND');
    }

    const json = await response.json();

    if (!response.ok) {
      throw buildError(response.status, json.message || 'Error al obtener el split', 'UNKNOWN');
    }

    return json.data;
  } catch (error) {
    if (error instanceof SplitsApiError) {
      throw error;
    }
    throw buildError(0, 'Error de red al conectar con el servidor', 'NETWORK_ERROR');
  }
}

export async function createSplit(
  payload: CreateSplitPayload,
  options: FetchOptions
): Promise<Split> {
  const { token } = options;

  try {
    const response = await fetch(`${Config.apiUrl}/workout/splits`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      throw buildError(401, 'Sesión expirada. Por favor, inicia sesión nuevamente.', 'UNAUTHORIZED');
    }

    const json = await response.json();

    if (response.status === 400) {
      throw buildError(400, json.message || 'Datos de split inválidos', 'VALIDATION');
    }

    if (!response.ok) {
      throw buildError(response.status, json.message || 'Error al crear el split', 'UNKNOWN');
    }

    return json.data;
  } catch (error) {
    if (error instanceof SplitsApiError) {
      throw error;
    }
    throw buildError(0, 'Error de red al conectar con el servidor', 'NETWORK_ERROR');
  }
}

export async function updateSplit(
  splitId: string,
  payload: UpdateSplitPayload,
  options: FetchOptions
): Promise<Split> {
  const { token } = options;

  try {
    const response = await fetch(`${Config.apiUrl}/workout/splits/${splitId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      throw buildError(401, 'Sesión expirada. Por favor, inicia sesión nuevamente.', 'UNAUTHORIZED');
    }

    if (response.status === 403) {
      throw buildError(403, 'No tienes permiso para modificar este split', 'FORBIDDEN');
    }

    if (response.status === 404) {
      throw buildError(404, 'Split no encontrado', 'NOT_FOUND');
    }

    const json = await response.json();

    if (response.status === 400) {
      throw buildError(400, json.message || 'Datos de split inválidos', 'VALIDATION');
    }

    if (!response.ok) {
      throw buildError(response.status, json.message || 'Error al actualizar el split', 'UNKNOWN');
    }

    return json.data;
  } catch (error) {
    if (error instanceof SplitsApiError) {
      throw error;
    }
    throw buildError(0, 'Error de red al conectar con el servidor', 'NETWORK_ERROR');
  }
}

export async function deleteSplit(
  splitId: string,
  options: FetchOptions
): Promise<void> {
  const { token } = options;

  try {
    const response = await fetch(`${Config.apiUrl}/workout/splits/${splitId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw buildError(401, 'Sesión expirada. Por favor, inicia sesión nuevamente.', 'UNAUTHORIZED');
    }

    if (response.status === 403) {
      throw buildError(403, 'No tienes permiso para eliminar este split', 'FORBIDDEN');
    }

    if (response.status === 404) {
      throw buildError(404, 'Split no encontrado', 'NOT_FOUND');
    }

    if (!response.ok && response.status !== 204) {
      const json = await response.json();
      throw buildError(response.status, json.message || 'Error al eliminar el split', 'UNKNOWN');
    }
  } catch (error) {
    if (error instanceof SplitsApiError) {
      throw error;
    }
    throw buildError(0, 'Error de red al conectar con el servidor', 'NETWORK_ERROR');
  }
}
