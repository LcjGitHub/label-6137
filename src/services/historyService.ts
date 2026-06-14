import type { PracticeRecord } from '@/types/score';

const STORAGE_KEY = 'practice_history';

export function loadHistory(): PracticeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(records: PracticeRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function appendRecord(record: PracticeRecord): void {
  const records = loadHistory();
  records.unshift(record);
  saveHistory(records);
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
