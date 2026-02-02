import { useCallback, useState } from 'react';
import { Exercise } from './use-exercises';

export type UseExerciseSelectorReturn = {
  selectedExercises: Exercise[];
  selectedIds: Set<string>;
  toggleExercise: (exercise: Exercise) => void;
  selectAll: (exercises: Exercise[]) => void;
  clearSelection: () => void;
  removeExercise: (exerciseId: string) => void;
  getSelectedCount: () => number;
};

export function useExerciseSelector(): UseExerciseSelectorReturn {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);

  const toggleExercise = useCallback((exercise: Exercise) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(exercise.id)) {
        newSet.delete(exercise.id);
      } else {
        newSet.add(exercise.id);
      }
      return newSet;
    });

    setSelectedExercises((prev) => {
      if (prev.find((ex) => ex.id === exercise.id)) {
        return prev.filter((ex) => ex.id !== exercise.id);
      }
      return [...prev, exercise];
    });
  }, []);

  const selectAll = useCallback((exercises: Exercise[]) => {
    const allIds = new Set(exercises.map((ex) => ex.id));
    setSelectedIds(allIds);
    setSelectedExercises(exercises);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectedExercises([]);
  }, []);

  const removeExercise = useCallback((exerciseId: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(exerciseId);
      return newSet;
    });

    setSelectedExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  }, []);

  const getSelectedCount = useCallback(() => {
    return selectedIds.size;
  }, [selectedIds]);

  return {
    selectedExercises,
    selectedIds,
    toggleExercise,
    selectAll,
    clearSelection,
    removeExercise,
    getSelectedCount,
  };
}
