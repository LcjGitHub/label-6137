import type { HideMode } from '@/types/score';

const HIDE_MODE_KEY = 'practice_hide_mode';
const DEFAULT_HIDE_MODE: HideMode = 'jianpu';

export function getStoredHideMode(): HideMode {
  try {
    const stored = localStorage.getItem(HIDE_MODE_KEY);
    if (stored === 'jianpu' || stored === 'staff') {
      return stored;
    }
    return DEFAULT_HIDE_MODE;
  } catch {
    return DEFAULT_HIDE_MODE;
  }
}

export function setStoredHideMode(mode: HideMode): void {
  try {
    localStorage.setItem(HIDE_MODE_KEY, mode);
  } catch {
    // ignore
  }
}
