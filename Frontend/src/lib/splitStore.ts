export enum Days {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export type Split = {
  id: string;
  name: string;
  description?: string;
  nTrainingDays: number;
  nRestDays: number;
  trainingDays: Days[];
  official: boolean;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = 'athletia_splits';

function getCustomSplits(): Split[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Split[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(splits: Split[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(splits));
}

export function getAllSplits(): Split[] {
  return getCustomSplits();
}

export function getSplitById(id: string): Split | undefined {
  return getCustomSplits().find((s) => s.id === id);
}

export function upsertSplit(input: Split): Split {
  const splits = getCustomSplits();
  const idx = splits.findIndex((s) => s.id === input.id);
  const record: Split = {
    ...input,
    id: input.id || crypto.randomUUID(),
    createdAt: input.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) {
    splits[idx] = record;
  } else {
    splits.push(record);
  }
  persist(splits);
  return record;
}

export function deleteSplit(id: string): boolean {
  const splits = getCustomSplits();
  const filtered = splits.filter((s) => s.id !== id);
  if (filtered.length === splits.length) return false;
  persist(filtered);
  return true;
}
