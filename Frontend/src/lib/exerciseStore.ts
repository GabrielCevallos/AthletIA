import { MuscleTarget, Equipment, ExerciseType } from './enums';

export type StoredMedia = {
  id: string;
  name: string;
  size: number;
  type: string;
  data: string;
};

export type ExerciseVariant = { name: string; notes?: string };
export type ExerciseBenefit = { title: string; description?: string; categories?: string[] };
export type Exercise = {
  id: string;
  name: string;
  muscleTarget: MuscleTarget[];
  equipment: Equipment;
  description?: string;
  mediaFiles: StoredMedia[];
  instructions: string[];
  benefit?: ExerciseBenefit | null;
  variants: ExerciseVariant[];
  isPublic: boolean;
  createdAt: string;
  coverUrl?: string;
  isSeed?: boolean;
  parentExerciseId?: string | null;
  parentExercise?: { id: string; name: string; equipment: Equipment } | null;
  
  // Backend required fields
  video?: string;
  minSets?: number;
  maxSets?: number;
  minReps?: number;
  maxReps?: number;
  minRestTime?: number;
  maxRestTime?: number;
  exerciseType?: ExerciseType[];
  
  // Legacy fields para compatibilidad temporal
  muscle?: string;
  secondaryMuscle?: string;
};

const STORAGE_KEY = 'athletia_exercises';

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'seed-1',
    name: 'Press de Banca',
    muscleTarget: [MuscleTarget.CHEST, MuscleTarget.TRICEPS, MuscleTarget.DELTOIDS],
    equipment: Equipment.BARBELL,
    description: 'Ejercicio de empuje para pectorales, tríceps y deltoides frontales.',
    mediaFiles: [],
    instructions: [],
    variants: [],
    isPublic: true,
    createdAt: new Date().toISOString(),
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYGZNXa4LuDhTx1bscK4ZBNFpdzQ7g8vTjtjZceD2Ul_F64R-AlDuaNjc74zb76gRLj-KopyoCesqgApr9rqGZBR4rRdpKfQ_O_1rQzn0NJIZkiOweiV80PKIHTNsCatCdtKoGkUe-ZSmkVMWQlm5llQffy8f2ZRQvgMoX2oWD7U5boeVlrbeWd6Fp8bWSWSn1nDnHJBqEs-SncrQUW-S6pChqIdO_uyL9oqokLlQK8eX1Eh1Ymqi2Cs8XmsIitHcA1IdujZSRNMjb',
    isSeed: true,
  },
  {
    id: 'seed-2',
    name: 'Sentadilla',
    muscleTarget: [MuscleTarget.QUADS, MuscleTarget.GLUTES, MuscleTarget.HAMSTRINGS],
    equipment: Equipment.BARBELL,
    description: 'Patrón de sentadilla con barra que trabaja cuádriceps y glúteos.',
    mediaFiles: [],
    instructions: [],
    variants: [],
    isPublic: true,
    createdAt: new Date().toISOString(),
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUjwXRe0fwAZ8zICVtdjJNIj3bTkYuvVBewSUAH9Wb-BTRcfOA0Yy00rf0tdxRW1JmDX5P48NivvTeMI3JsKdFEZtqwQoTZu9IOAQ1vgjRt5KbE59JwmpYZYA04iQhrzY2EqdtMaJ6NWO0Xseg3vfi3jYZY2-gxhur6d2XCUDpneeGxvWi4o52a1DV6_yhPjxYovvQv-bH3uHFoyMB0RiEnIavkh-x2LSt4mg3rP9PFl4wozPbAF-bVI6OO_qEq0iFf_ClsG3cldsi',
    isSeed: true,
  },
  {
    id: 'seed-3',
    name: 'Peso Muerto',
    muscleTarget: [MuscleTarget.LATS, MuscleTarget.GLUTES, MuscleTarget.HAMSTRINGS, MuscleTarget.TRAPEZIUS],
    equipment: Equipment.BARBELL,
    description: 'Bisagra de cadera fundamental para cadena posterior.',
    mediaFiles: [],
    instructions: [],
    variants: [],
    isPublic: true,
    createdAt: new Date().toISOString(),
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyQUfducB4EeuiivhpILxGTCJeJgcX_dymfhnABUAwnFwkN4FGLTN5Q0ER7KPa4xelclVjjGGbXGSJPh-5GksPMsPcIaABeqZ4ulgCT45eB0YW-3CLPdtUHy57NTn5EkyQSVJEkurG0zui_VgMvZOz2t45Jfo8wnblU11bfFOc0fdTb59fvRVLCG8pcjmM2DVZ_2QnSMxp7RF2BVLNOrmBg7e7MH0WxE87k7XwGwbha0Z9B9rgSpAdKqm8T_z0CmEEScY26AcZvbCk',
    isSeed: true,
  },
  {
    id: 'seed-4',
    name: 'Dominadas',
    muscleTarget: [MuscleTarget.LATS, MuscleTarget.BICEPS, MuscleTarget.TRAPEZIUS],
    equipment: Equipment.BODYWEIGHT,
    description: 'Tracción vertical para dorsales y flexores de codo.',
    mediaFiles: [],
    instructions: [],
    variants: [],
    isPublic: true,
    createdAt: new Date().toISOString(),
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6WPDs96rwBSB5FCAsx9Q6HkNPMfAFCzSHxcsXCZ-uhrtz5NQ8M9N22Ne5dOVpD6E5L00ho2Rh_gQPIR8F9toHDrBUAFhjraZSpUWonK2kDX4_zlWagqrly1hnfwpunrjro5HmB9J1zGGFY9ZCmrC3vtA-D0td522SOnlVPzt_OOvayaWvwnoMNQ4DY-fygQceh5hDPOw6WBKqn8JjxAWJFm5ApFtYVJSJ1WoUTBF8yiPqtmx9HOcV8I1aF8W2WNbfSH587b9-Lrae',
    isSeed: true,
  },
  {
    id: 'seed-5',
    name: 'Curl con Barra',
    muscleTarget: [MuscleTarget.BICEPS, MuscleTarget.FOREARMS],
    equipment: Equipment.BARBELL,
    description: 'Flexión de codo con barra para bíceps braquial.',
    mediaFiles: [],
    instructions: [],
    variants: [],
    isPublic: true,
    createdAt: new Date().toISOString(),
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFyWkqy_KDhIAiVe60FEmbsRjveXMO0WM_zdx5sUQ7zq7VtYMtfhDd5iMS1-gUjo43Ncw0cIDEfRbnn4kal5hvJFBvm6OJWtM2qysrqXPxdYqKxshX8tZQpsSG5WaWhP_SVwFJMff842Wof3nYCBWNYdcaxL_w4K8No2yjwnblW7yHon50awnHp1h4nLFT9zRSQK-zXRAjBLRtYM-52JKHqUarh8Dklj9nJpcPv40_Q4mFiRloyFi10FEuyColfuuG0sWR6l_h3fsN',
    isSeed: true,
  },
];

function getCustomExercises(): Exercise[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Exercise[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(custom: Exercise[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
}

export function getAllExercises(): Exercise[] {
  return [...DEFAULT_EXERCISES, ...getCustomExercises()];
}

export function getExerciseById(id: string): Exercise | undefined {
  const seeds = DEFAULT_EXERCISES.find((ex) => ex.id === id);
  if (seeds) return seeds;
  return getCustomExercises().find((ex) => ex.id === id);
}

export function upsertExercise(input: Exercise): Exercise {
  const custom = getCustomExercises();
  const existsIdx = custom.findIndex((ex) => ex.id === input.id);
  const record: Exercise = {
    ...input,
    id: input.id || crypto.randomUUID(),
    createdAt: input.createdAt || new Date().toISOString(),
    isSeed: false,
  };
  if (existsIdx >= 0) {
    custom[existsIdx] = record;
  } else {
    custom.push(record);
  }
  persist(custom);
  return record;
}

// Validation functions - synchronized with backend DTO
export interface ValidationError {
  field: string;
  message: string;
}

export function validateExerciseName(name: string): ValidationError | null {
  if (!name || !name.trim()) {
    return { field: 'name', message: 'El nombre es requerido' };
  }
  if (name.trim().length < 3) {
    return { field: 'name', message: 'El nombre debe tener al menos 3 caracteres' };
  }
  if (name.length > 50) {
    return { field: 'name', message: 'El nombre no puede exceder 50 caracteres' };
  }
  return null;
}

export function validateExerciseDescription(description: string | undefined): ValidationError | null {
  if (!description || !description.trim()) {
    return { field: 'description', message: 'La descripción es requerida' };
  }
  if (description.trim().length < 10) {
    return { field: 'description', message: 'La descripción debe tener al menos 10 caracteres' };
  }
  if (description.length > 500) {
    return { field: 'description', message: 'La descripción no puede exceder 500 caracteres' };
  }
  return null;
}

export function validateExerciseEquipment(equipment: Equipment | undefined): ValidationError | null {
  if (!equipment) {
    return { field: 'equipment', message: 'El equipo es requerido' };
  }
  const validEquipments = Object.values(Equipment);
  if (!validEquipments.includes(equipment)) {
    return { field: 'equipment', message: 'Equipo inválido' };
  }
  return null;
}

export function validateExerciseVideo(video: string | undefined): ValidationError | null {
  if (!video || !video.trim()) {
    return { field: 'video', message: 'La URL del video es requerida' };
  }
  try {
    new URL(video.trim());
  } catch {
    return { field: 'video', message: 'La URL del video no es válida' };
  }
  return null;
}

export function validateMuscleTargets(muscleTargets: MuscleTarget[] | undefined): ValidationError | null {
  if (!muscleTargets || muscleTargets.length === 0) {
    return { field: 'muscleTarget', message: 'Debe seleccionar al menos un grupo muscular' };
  }
  const validMuscles = Object.values(MuscleTarget);
  for (const muscle of muscleTargets) {
    if (!validMuscles.includes(muscle)) {
      return { field: 'muscleTarget', message: 'Grupo muscular inválido' };
    }
  }
  return null;
}

export function validateExerciseTypes(exerciseTypes: ExerciseType[] | undefined): ValidationError | null {
  if (!exerciseTypes || exerciseTypes.length === 0) {
    return { field: 'exerciseType', message: 'Debe seleccionar al menos un tipo de ejercicio' };
  }
  const validTypes = Object.values(ExerciseType);
  for (const type of exerciseTypes) {
    if (!validTypes.includes(type)) {
      return { field: 'exerciseType', message: 'Tipo de ejercicio inválido' };
    }
  }
  return null;
}

export function validateMinSets(minSets: number | undefined): ValidationError | null {
  if (minSets === undefined || minSets === null) {
    return { field: 'minSets', message: 'Series mínimas es requerido' };
  }
  if (!Number.isInteger(minSets)) {
    return { field: 'minSets', message: 'Series mínimas debe ser un número entero' };
  }
  if (minSets < 1) {
    return { field: 'minSets', message: 'Series mínimas debe ser al menos 1' };
  }
  return null;
}

export function validateMaxSets(maxSets: number | undefined): ValidationError | null {
  if (maxSets === undefined || maxSets === null) {
    return { field: 'maxSets', message: 'Series máximas es requerido' };
  }
  if (!Number.isInteger(maxSets)) {
    return { field: 'maxSets', message: 'Series máximas debe ser un número entero' };
  }
  if (maxSets < 1) {
    return { field: 'maxSets', message: 'Series máximas debe ser al menos 1' };
  }
  if (maxSets > 10) {
    return { field: 'maxSets', message: 'Series máximas no puede exceder 10' };
  }
  return null;
}

export function validateMinReps(minReps: number | undefined): ValidationError | null {
  if (minReps === undefined || minReps === null) {
    return { field: 'minReps', message: 'Repeticiones mínimas es requerido' };
  }
  if (!Number.isInteger(minReps)) {
    return { field: 'minReps', message: 'Repeticiones mínimas debe ser un número entero' };
  }
  if (minReps < 1) {
    return { field: 'minReps', message: 'Repeticiones mínimas debe ser al menos 1' };
  }
  return null;
}

export function validateMaxReps(maxReps: number | undefined): ValidationError | null {
  if (maxReps === undefined || maxReps === null) {
    return { field: 'maxReps', message: 'Repeticiones máximas es requerido' };
  }
  if (!Number.isInteger(maxReps)) {
    return { field: 'maxReps', message: 'Repeticiones máximas debe ser un número entero' };
  }
  if (maxReps < 1) {
    return { field: 'maxReps', message: 'Repeticiones máximas debe ser al menos 1' };
  }
  if (maxReps > 60) {
    return { field: 'maxReps', message: 'Repeticiones máximas no puede exceder 60' };
  }
  return null;
}

export function validateMinRestTime(minRestTime: number | undefined): ValidationError | null {
  if (minRestTime === undefined || minRestTime === null) {
    return { field: 'minRestTime', message: 'Descanso mínimo es requerido' };
  }
  if (!Number.isInteger(minRestTime)) {
    return { field: 'minRestTime', message: 'Descanso mínimo debe ser un número entero (segundos)' };
  }
  if (minRestTime < 10) {
    return { field: 'minRestTime', message: 'Descanso mínimo debe ser al menos 10 segundos' };
  }
  return null;
}

export function validateMaxRestTime(maxRestTime: number | undefined): ValidationError | null {
  if (maxRestTime === undefined || maxRestTime === null) {
    return { field: 'maxRestTime', message: 'Descanso máximo es requerido' };
  }
  if (!Number.isInteger(maxRestTime)) {
    return { field: 'maxRestTime', message: 'Descanso máximo debe ser un número entero (segundos)' };
  }
  if (maxRestTime < 10) {
    return { field: 'maxRestTime', message: 'Descanso máximo debe ser al menos 10 segundos' };
  }
  if (maxRestTime > 600) {
    return { field: 'maxRestTime', message: 'Descanso máximo no puede exceder 600 segundos' };
  }
  return null;
}

// Validate complete exercise
export function validateCompleteExercise(exercise: Partial<Exercise>): ValidationError[] {
  const errors: ValidationError[] = [];

  const nameError = validateExerciseName(exercise.name || '');
  if (nameError) errors.push(nameError);

  // Descripción ya no es requerida - se eliminó el paso 4

  const equipError = validateExerciseEquipment(exercise.equipment);
  if (equipError) errors.push(equipError);

  const muscleError = validateMuscleTargets(exercise.muscleTarget);
  if (muscleError) errors.push(muscleError);

  const typeError = validateExerciseTypes(exercise.exerciseType);
  if (typeError) errors.push(typeError);

  // Note: Estos campos ya no se validan en el formulario simplificado
  // minSets, maxSets, minReps, maxReps, minRestTime, maxRestTime son opcionales

  return errors;
}


export function deleteExercise(id: string): boolean {
  const custom = getCustomExercises();
  const filtered = custom.filter((ex) => ex.id !== id);
  if (filtered.length === custom.length) {
    // no delete for seeds
    return false;
  }
  persist(filtered);
  return true;
}
