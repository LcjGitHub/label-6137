import { create } from 'zustand';
import type { HideMode } from '@/types/score';

interface PracticeState {
  hideMode: HideMode;
  setHideMode: (mode: HideMode) => void;
  reset: () => void;
}

/** 练习页全局状态：控制隐藏简谱或五线谱 */
export const usePracticeStore = create<PracticeState>((set) => ({
  hideMode: 'jianpu',
  setHideMode: (mode) => set({ hideMode: mode }),
  reset: () => set({ hideMode: 'jianpu' }),
}));
