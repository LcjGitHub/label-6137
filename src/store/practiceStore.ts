import { create } from 'zustand';
import type { HideMode } from '@/types/score';

interface PracticeState {
  hideMode: HideMode;
  isRandomMode: boolean;
  randomHideMode: HideMode | null;
  setHideMode: (mode: HideMode) => void;
  setRandomMode: (hideMode: HideMode) => void;
  clearRandomMode: () => void;
  reset: () => void;
}

export const usePracticeStore = create<PracticeState>((set) => ({
  hideMode: 'jianpu',
  isRandomMode: false,
  randomHideMode: null,
  setHideMode: (mode) => set({ hideMode: mode }),
  setRandomMode: (hideMode) =>
    set({ isRandomMode: true, randomHideMode: hideMode, hideMode }),
  clearRandomMode: () =>
    set({ isRandomMode: false, randomHideMode: null }),
  reset: () =>
    set({ hideMode: 'jianpu', isRandomMode: false, randomHideMode: null }),
}));
