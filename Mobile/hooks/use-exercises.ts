import { Config } from '@/constants';
import { useAuth } from '@/context/auth-context';
import { handleApiError } from '@/services/api-error-handler';
import { useCallback, useEffect, useState } from 'react';

export type Exercise = {
  id: string;
  name: string;
  category?: 'chest' | 'back' | 'legs' | 'cardio' | 'arms';
  muscleTarget?: string; // Grupo muscular principal
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  description?: string;
  imageUrl: string;
  instructions?: string[];
  muscleGroups?: string[];
  equipment?: string | string[]; // Puede ser string o array
  videoUrl?: string;
  variants?: Exercise[];
  exerciseType?: string[];
  benefit?: {
    title: string;
    description: string;
    categories?: string[];
  };
  minSets?: number;
  maxSets?: number;
  minReps?: number;
  maxReps?: number;
  minRestTime?: number;
  maxRestTime?: number;
};

export type UseExercisesReturn = {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getExerciseById: (id: string) => Promise<Exercise | null>;
};

export function useExercises(muscleTarget?: string): UseExercisesReturn {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    // Validar autenticación
    if (!user?.token) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Construir URL con parámetros opcionales
      const url = new URL(`${Config.apiUrl}/workout/exercises`);
      if (muscleTarget) url.searchParams.append('muscleTarget', muscleTarget);
      console.log('Fetching exercises from URL:', url.toString());

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        const error = new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        await handleApiError(error);
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        return;
      }

      if (response.status === 403) {
        setError('No tienes permiso para acceder a esta sección.');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      console.log('API Response:', JSON.stringify(result, null, 2));

      // El backend puede retornar directamente un array o con estructura success
      let items: any[] = [];
      if (Array.isArray(result)) {
        items = result;
      } else if (result.success && Array.isArray(result.data?.items)) {
        items = result.data.items;
      } else if (result.data && Array.isArray(result.data)) {
        items = result.data;
      } else {
        setError(`Formato de respuesta inválido: ${JSON.stringify(result).substring(0, 100)}`);
        console.error('Invalid response format:', result);
        return;
      }

      // Normalizar datos de la API
      const normalized = items.map(normalizeExercise);
      setExercises(normalized);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar ejercicios';
      setError(errorMessage);
      console.error('Fetch exercises error:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.token, muscleTarget]);

  const getExerciseById = useCallback(
    async (id: string): Promise<Exercise | null> => {
      if (!user?.token) {
        setError('Usuario no autenticado');
        return null;
      }

      try {
        const response = await fetch(`${Config.apiUrl}/workout/exercises/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          const error = new Error('Sesión expirada');
          await handleApiError(error);
          setError('Sesión expirada');
          return null;
        }

        if (response.status === 403) {
          setError('No tienes permiso para acceder a este ejercicio');
          return null;
        }

        if (!response.ok) {
          console.error(`Error fetching exercise: HTTP ${response.status}`);
          return null;
        }

        const result = await response.json();
        if (result.success && result.data) {
          return normalizeExercise(result.data);
        }
        return null;
      } catch (err) {
        console.error('Get exercise error:', err);
        return null;
      }
    },
    [user?.token]
  );

  useEffect(() => {
    void fetchExercises();
  }, [fetchExercises]);

  return {
    exercises,
    loading,
    error,
    refetch: fetchExercises,
    getExerciseById,
  };
}

/**
 * Normaliza datos de ejercicio de la API a formato local consistente
 */
function normalizeExercise(data: any): Exercise {
  return {
    id: data.id || '',
    name: data.name || '',
    description: data.description,
    difficulty: data.difficulty || 'Intermedio',
    imageUrl: data.imageUrl || data.video || 'https://via.placeholder.com/300',
    videoUrl: data.video || data.videoUrl,
    // Normalizar equipment: si es string, convertir a array; si es undefined, dejar como undefined
    equipment: data.equipment 
      ? (Array.isArray(data.equipment) ? data.equipment : [data.equipment]) 
      : undefined,
    // muscleTarget puede ser string o array; si es array, tomar el primero
    muscleTarget: Array.isArray(data.muscleTarget) 
      ? data.muscleTarget[0] 
      : data.muscleTarget,
    muscleGroups: Array.isArray(data.muscleTarget) 
      ? data.muscleTarget 
      : data.muscleGroups,
    instructions: data.instructions,
    exerciseType: data.exerciseType,
    benefit: data.benefit,
    minSets: data.minSets,
    maxSets: data.maxSets,
    minReps: data.minReps,
    maxReps: data.maxReps,
    minRestTime: data.minRestTime,
    maxRestTime: data.maxRestTime,
  };
}
