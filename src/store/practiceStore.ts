import { create } from 'zustand';
import type { HideMode } from '@/types/score';

/** 练习页全局状态接口 */
interface PracticeState {
  /** 当前隐藏模式：隐藏简谱或隐藏五线谱 */
  hideMode: HideMode;
  /** 是否为随机练习模式（待应用标记） */
  isRandomMode: boolean;
  /** 随机练习选中的隐藏模式（待应用） */
  randomHideMode: HideMode | null;
  /** 记录各题目是否已使用过提示（key: 曲目id） */
  hintUsedMap: Record<string, boolean>;
  /** 设置当前隐藏模式 */
  setHideMode: (mode: HideMode) => void;
  /** 标记为随机练习模式并传入随机选中的隐藏模式 */
  setRandomMode: (hideMode: HideMode) => void;
  /** 清除随机练习模式标记 */
  clearRandomMode: () => void;
  /** 标记指定题目已使用提示 */
  markHintUsed: (scoreId: string) => void;
  /** 检查指定题目是否已使用提示 */
  isHintUsed: (scoreId: string) => boolean;
  /** 重置除提示使用记录外的所有状态为默认值 */
  resetKeepHints: () => void;
  /** 重置所有状态为默认值（包含清空提示记录） */
  reset: () => void;
}

/** 练习页全局状态：控制隐藏简谱或五线谱，支持随机练习模式标记 */
export const usePracticeStore = create<PracticeState>((set, get) => ({
  hideMode: 'jianpu',
  isRandomMode: false,
  randomHideMode: null,
  hintUsedMap: {},
  setHideMode: (mode) => set({ hideMode: mode }),
  setRandomMode: (hideMode) =>
    set({ isRandomMode: true, randomHideMode: hideMode, hideMode }),
  clearRandomMode: () =>
    set({ isRandomMode: false, randomHideMode: null }),
  markHintUsed: (scoreId) =>
    set((state) => ({
      hintUsedMap: { ...state.hintUsedMap, [scoreId]: true },
    })),
  isHintUsed: (scoreId) => get().hintUsedMap[scoreId] ?? false,
  resetKeepHints: () =>
    set({
      hideMode: 'jianpu',
      isRandomMode: false,
      randomHideMode: null,
    }),
  reset: () =>
    set({
      hideMode: 'jianpu',
      isRandomMode: false,
      randomHideMode: null,
      hintUsedMap: {},
    }),
}));
