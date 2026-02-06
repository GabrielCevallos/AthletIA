import { useAuth } from '@/context/auth-context';
import { handleApiError } from '@/services/api-error-handler';
import * as SplitsApi from '@/services/splits-api';
import { useCallback, useEffect, useState } from 'react';

export type Split = SplitsApi.Split;
export type CreateSplitPayload = SplitsApi.CreateSplitPayload;
export type UpdateSplitPayload = SplitsApi.UpdateSplitPayload;

export type UseSplitsState = {
  splits: Split[];
  loading: boolean;
  error: string | null;
  total: number;
};

export type UseSplitsActions = {
  fetchSplits: (params?: { limit?: number; offset?: number }) => Promise<void>;
  fetchSplitById: (id: string) => Promise<Split | null>;
  createSplit: (payload: CreateSplitPayload) => Promise<Split | null>;
  updateSplit: (id: string, payload: UpdateSplitPayload) => Promise<Split | null>;
  deleteSplit: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
};

export type UseSplitsReturn = UseSplitsState & UseSplitsActions;

type UseSplitsOptions = {
  autoFetch?: boolean;
};

export function useSplits(options?: UseSplitsOptions): UseSplitsReturn {
  const { user } = useAuth();
  const [splits, setSplits] = useState<Split[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchSplits = useCallback(
    async (params?: { limit?: number; offset?: number }) => {
      if (!user?.token) {
        setError('No hay sesión activa');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await SplitsApi.fetchSplits({
          token: user.token,
          limit: params?.limit,
          offset: params?.offset,
        });

        const items = response.items || [];
        // Deduplicate splits based on ID
        const uniqueItems = Array.from(new Map(items.map((item) => [item.id, item])).values());
        if (items.length !== uniqueItems.length) {
          console.warn(`[use-splits] Found ${items.length - uniqueItems.length} duplicate splits`);
        }

        setSplits(uniqueItems);
        setTotal(response.total || 0);
      } catch (err) {
        await handleApiError(err);
        const errorMessage =
          err instanceof SplitsApi.SplitsApiError ? err.message : 'Error al cargar los splits';
        setError(errorMessage);
        console.error('Error fetching splits:', err);
      } finally {
        setLoading(false);
      }
    },
    [user?.token]
  );

  const fetchSplitById = useCallback(
    async (id: string): Promise<Split | null> => {
      if (!user?.token) {
        setError('No hay sesión activa');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const split = await SplitsApi.fetchSplitById(id, {
          token: user.token,
        });

        return split;
      } catch (err) {
        await handleApiError(err);
        const errorMessage =
          err instanceof SplitsApi.SplitsApiError ? err.message : 'Error al cargar el split';
        setError(errorMessage);
        console.error('Error fetching split by ID:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user?.token]
  );

  const createSplit = useCallback(
    async (payload: CreateSplitPayload): Promise<Split | null> => {
      if (!user?.token) {
        setError('No hay sesión activa');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const newSplit = await SplitsApi.createSplit(payload, {
          token: user.token,
        });

        // Add to local state
        setSplits((prev) => [newSplit, ...prev]);
        setTotal((prev) => prev + 1);

        return newSplit;
      } catch (err) {
        await handleApiError(err);
        const errorMessage =
          err instanceof SplitsApi.SplitsApiError ? err.message : 'Error al crear el split';
        setError(errorMessage);
        console.error('Error creating split:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user?.token]
  );

  const updateSplit = useCallback(
    async (id: string, payload: UpdateSplitPayload): Promise<Split | null> => {
      if (!user?.token) {
        setError('No hay sesión activa');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const updatedSplit = await SplitsApi.updateSplit(id, payload, {
          token: user.token,
        });

        // Update in local state
        setSplits((prev) => prev.map((split) => (split.id === id ? updatedSplit : split)));

        return updatedSplit;
      } catch (err) {
        await handleApiError(err);
        const errorMessage =
          err instanceof SplitsApi.SplitsApiError ? err.message : 'Error al actualizar el split';
        setError(errorMessage);
        console.error('Error updating split:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user?.token]
  );

  const deleteSplit = useCallback(
    async (id: string): Promise<boolean> => {
      if (!user?.token) {
        setError('No hay sesión activa');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        await SplitsApi.deleteSplit(id, {
          token: user.token,
        });

        // Remove from local state
        setSplits((prev) => prev.filter((split) => split.id !== id));
        setTotal((prev) => prev - 1);

        return true;
      } catch (err) {
        await handleApiError(err);
        const errorMessage =
          err instanceof SplitsApi.SplitsApiError ? err.message : 'Error al eliminar el split';
        setError(errorMessage);
        console.error('Error deleting split:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user?.token]
  );

  const refresh = useCallback(async () => {
    await fetchSplits();
  }, [fetchSplits]);

  // Initial load
  useEffect(() => {
    if (options?.autoFetch === false) return;
    if (user?.token) {
      fetchSplits();
    }
  }, [user?.token, fetchSplits, options?.autoFetch]);

  return {
    splits,
    loading,
    error,
    total,
    fetchSplits,
    fetchSplitById,
    createSplit,
    updateSplit,
    deleteSplit,
    refresh,
  };
}
