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
  muscle: string;
  secondaryMuscle?: string;
  equipment?: string;
  description?: string;
  mediaFiles: StoredMedia[];
  instructions: string[];
  benefit?: ExerciseBenefit | null;
  variants: ExerciseVariant[];
  isPublic: boolean;
  createdAt: string;
  coverUrl?: string;
  isSeed?: boolean;
};

const STORAGE_KEY = 'athletia_exercises';

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'seed-1',
    name: 'Press de Banca',
    muscle: 'Pecho',
    equipment: 'Barra',
    description: 'Ejercicio de empuje para pectorales, tríceps y deltoides frontales.',
    mediaFiles: [],
    instructions: [],
    variants: [],
    isPublic: true,
    createdAt: new Date().toISOString(),
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYGZNXa4LuDhTx1bscK4ZBNFpdzQ7g8vTjtjZceD2Ul_F64R-AlDuaNjc74zb76gRLj-KopyoCesqgApr9rqGZBR4rRdpKfQ_O_1rQzn0NJIZkiOweiV80PKIHTNsCatCdtKoGkUe-ZSmkVMWQlm5llQffy8f2ZRQvgMoX2oWD7U5boeVlrbeWd6Fp8bWSWSn1nDnHJBqEs-SncrQUW-S6pChqIdO_uyL9oqokLlQK8eX1Eh1Ymqi2Cs8XmsIitHcA1IdujZSRNMjb'
  },
  {
    id: 'seed-2',
    name: 'Sentadilla',
    muscle: 'Piernas',
    equipment: 'Barra',
    description: 'Patrón de sentadilla con barra que trabaja cuádriceps y glúteos.',
    mediaFiles: [],
    instructions: [],
    variants: [],
    isPublic: true,
    createdAt: new Date().toISOString(),
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUjwXRe0fwAZ8zICVtdjJNIj3bTkYuvVBewSUAH9Wb-BTRcfOA0Yy00rf0tdxRW1JmDX5P48NivvTeMI3JsKdFEZtqwQoTZu9IOAQ1vgjRt5KbE59JwmpYZYA04iQhrzY2EqdtMaJ6NWO0Xseg3vfi3jYZY2-gxhur6d2XCUDpneeGxvWi4o52a1DV6_yhPjxYovvQv-bH3uHFoyMB0RiEnIavkh-x2LSt4mg3rP9PFl4wozPbAF-bVI6OO_qEq0iFf_ClsG3cldsi'
  },
  {
    id: 'seed-3',
    name: 'Peso Muerto',
    muscle: 'Espalda',
    equipment: 'Barra',
    description: 'Bisagra de cadera fundamental para cadena posterior.',
    mediaFiles: [],
    instructions: [],
    variants: [],
    isPublic: true,
    createdAt: new Date().toISOString(),
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyQUfducB4EeuiivhpILxGTCJeJgcX_dymfhnABUAwnFwkN4FGLTN5Q0ER7KPa4xelclVjjGGbXGSJPh-5GksPMsPcIaABeqZ4ulgCT45eB0YW-3CLPdtUHy57NTn5EkyQSVJEkurG0zui_VgMvZOz2t45Jfo8wnblU11bfFOc0fdTb59fvRVLCG8pcjmM2DVZ_2QnSMxp7RF2BVLNOrmBg7e7MH0WxE87k7XwGwbha0Z9B9rgSpAdKqm8T_z0CmEEScY26AcZvbCk'
  },
  {
    id: 'seed-4',
    name: 'Dominadas',
    muscle: 'Espalda',
    equipment: 'Peso corporal',
    description: 'Tracción vertical para dorsales y flexores de codo.',
    mediaFiles: [],
    instructions: [],
    variants: [],
    isPublic: true,
    createdAt: new Date().toISOString(),
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6WPDs96rwBSB5FCAsx9Q6HkNPMfAFCzSHxcsXCZ-uhrtz5NQ8M9N22Ne5dOVpD6E5L00ho2Rh_gQPIR8F9toHDrBUAFhjraZSpUWonK2kDX4_zlWagqrly1hnfwpunrjro5HmB9J1zGGFY9ZCmrC3vtA-D0td522SOnlVPzt_OOvayaWvwnoMNQ4DY-fygQceh5hDPOw6WBKqn8JjxAWJFm5ApFtYVJSJ1WoUTBF8yiPqtmx9HOcV8I1aF8W2WNbfSH587b9-Lrae'
  },
  {
    id: 'seed-5',
    name: 'Curl con Barra',
    muscle: 'Bíceps',
    equipment: 'Barra',
    description: 'Flexión de codo con barra para bíceps braquial.',
    mediaFiles: [],
    instructions: [],
    variants: [],
    isPublic: true,
    createdAt: new Date().toISOString(),
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFyWkqy_KDhIAiVe60FEmbsRjveXMO0WM_zdx5sUQ7zq7VtYMtfhDd5iMS1-gUjo43Ncw0cIDEfRbnn4kal5hvJFBvm6OJWtM2qysrqXPxdYqKxshX8tZQpsSG5WaWhP_SVwFJMff842Wof3nYCBWNYdcaxL_w4K8No2yjwnblW7yHon50awnHp1h4nLFT9zRSQK-zXRAjBLRtYM-52JKHqUarh8Dklj9nJpcPv40_Q4mFiRloyFi10FEuyColfuuG0sWR6l_h3fsN'
  },
].map((ex) => ({ ...ex, isSeed: true }));

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
