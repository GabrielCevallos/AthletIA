export type RoutineExercise = {
  id: string;
  name: string;
  muscle?: string;
  sets?: number;
  reps?: string;
  rest?: string;
  notes?: string;
  uid?: string;
};

export type Routine = {
  id: string;
  name: string;
  description?: string;
  exercises: RoutineExercise[];
  createdAt: string;
};

const STORAGE_KEY = 'athletia_routines';

function getCustomRoutines(): Routine[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Routine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(routines: Routine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines));
}

export function getAllRoutines(): Routine[] {
  return getCustomRoutines();
}

export function getRoutineById(id: string): Routine | undefined {
  return getCustomRoutines().find((r) => r.id === id);
}

export function upsertRoutine(input: Routine): Routine {
  const routines = getCustomRoutines();
  const idx = routines.findIndex((r) => r.id === input.id);
  const record: Routine = {
    ...input,
    id: input.id || crypto.randomUUID(),
    createdAt: input.createdAt || new Date().toISOString(),
  };
  if (idx >= 0) {
    routines[idx] = record;
  } else {
    routines.push(record);
  }
  persist(routines);
  return record;
}

export function deleteRoutine(id: string): boolean {
  const routines = getCustomRoutines();
  const filtered = routines.filter((r) => r.id !== id);
  if (filtered.length === routines.length) return false;
  persist(filtered);
  return true;
}
