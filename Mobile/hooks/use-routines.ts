import { useAuth } from '@/context/auth-context';
import { handleApiError } from '@/services/api-error-handler';
import {
    deleteRoutine as apiDeleteRoutine,
    fetchRoutineById,
    fetchRoutines,
    type Routine,
    type RoutineGoal,
    type RoutineListResponse,
    type RoutinesApiError,
} from '@/services/routines-api';
import { useCallback, useEffect, useState } from 'react';

export type UseRoutinesReturn = {
  routines: Routine[];
  loading: boolean;
  error: string | null;
  pagination: Omit<RoutineListResponse, 'items'> | null;
  refetch: (params?: { limit?: number; offset?: number }) => Promise<void>;
  getRoutineById: (id: string) => Promise<Routine | null>;
  fetchRoutineById: (id: string) => Promise<Routine | null>;
  deleteRoutine: (id: string) => Promise<boolean>;
};

export { type Routine, type RoutineGoal };

export function useRoutines(): UseRoutinesReturn {
  const { user } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Omit<RoutineListResponse, 'items'> | null>(null);

  const fetchAll = useCallback(
    async (params?: { limit?: number; offset?: number }) => {
      console.log('🔍 [use-routines] fetchAll iniciado');
      console.log('👤 [use-routines] Usuario:', user ? 'Presente' : 'No presente');
      console.log('🔑 [use-routines] Token:', user?.token ? `Presente (${user.token.substring(0, 20)}...)` : 'No presente');
      
      if (!user?.token) {
        console.error('❌ [use-routines] Usuario no autenticado');
        setError('Usuario no autenticado');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('📡 [use-routines] Llamando a fetchRoutines con params:', params);
        const result = await fetchRoutines({ token: user.token, ...params });
        console.log('🔍 [use-routines] Resultado de fetchRoutines:', result);
        console.log('🔍 [use-routines] Items recibidos:', result.items?.length || 0);
        
        const items = result.items || [];
        // Deduplicate routines based on ID
        const uniqueItems = Array.from(new Map(items.map((item) => [item.id, item])).values());
        if (items.length !== uniqueItems.length) {
          console.warn(`[use-routines] Found ${items.length - uniqueItems.length} duplicate routines`);
        }

        setRoutines(uniqueItems);
        setPagination({
          total: result.total,
          limit: result.limit,
          offset: result.offset,
        });
      } catch (err) {
        console.error('❌ [use-routines] Error en fetchAll:', err);
        await handleApiError(err);
        const apiError = err as RoutinesApiError;
        const message = apiError?.message || 'Error al cargar rutinas';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [user?.token]
  );

  const getRoutineById = useCallback(
    async (id: string): Promise<Routine | null> => {
      if (!user?.token) {
        setError('Usuario no autenticado');
        return null;
      }

      try {
        return await fetchRoutineById(id, { token: user.token });
      } catch (err) {
        await handleApiError(err);
        const apiError = err as RoutinesApiError;
        setError(apiError?.message || 'Error al cargar rutina');
        return null;
      }
    },
    [user?.token]
  );

  const deleteRoutine = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user?.token) {
        setError('Usuario no autenticado');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        await apiDeleteRoutine(id, { token: user.token });
        // Remove from local state
        setRoutines((prev) => prev.filter((routine) => routine.id !== id));
        return true;
      } catch (err) {
        await handleApiError(err);
        const apiError = err as RoutinesApiError;
        setError(apiError?.message || 'Error al eliminar rutina');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user?.token]
  );

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  return {
    routines,
    loading,
    error,
    pagination,
    refetch: fetchAll,
    getRoutineById,
    fetchRoutineById: getRoutineById,
    deleteRoutine,
  };
}
