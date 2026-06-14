import { getAllScores } from './scoreService';
import type { Score, HideMode } from '@/types/score';

/** 随机练习结果：包含抽中的曲目与随机决定的隐藏模式 */
export interface RandomPracticeResult {
  score: Score;
  hideMode: HideMode;
}

const HIDE_MODES: HideMode[] = ['jianpu', 'staff'];

/** 生成 [0, length) 范围内的随机整数索引 */
function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

/** 从全部曲目中随机抽取一首 */
export function getRandomScore(): Score {
  const scores = getAllScores();
  if (scores.length === 0) {
    throw new Error('没有可用的曲目');
  }
  return scores[randomIndex(scores.length)];
}

/** 随机决定隐藏简谱或五线谱 */
export function getRandomHideMode(): HideMode {
  return HIDE_MODES[randomIndex(HIDE_MODES.length)];
}

/** 生成完整随机练习：随机抽取曲目 + 随机决定隐藏模式 */
export function generateRandomPractice(): RandomPracticeResult {
  const scores = getAllScores();
  const score = scores[randomIndex(scores.length)];
  const hideMode = HIDE_MODES[randomIndex(HIDE_MODES.length)];
  return { score, hideMode };
}
