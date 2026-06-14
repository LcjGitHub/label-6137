import type { DifficultyLevel } from '@/types/score';

/** 难度等级对应的中文标签 */
export const difficultyLabelMap: Record<DifficultyLevel, string> = {
  beginner: '入门',
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

/** 难度等级对应的标签颜色 */
export const difficultyColorMap: Record<DifficultyLevel, string> = {
  beginner: 'green',
  easy: 'blue',
  medium: 'orange',
  hard: 'red',
};
