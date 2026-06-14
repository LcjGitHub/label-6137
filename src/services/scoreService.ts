import scoresData from '@/mock/scores.json';
import type { Score } from '@/types/score';

const scores = scoresData as Score[];

/** 获取全部曲目 */
export function getAllScores(): Score[] {
  return scores;
}

/** 按 ID 获取曲目 */
export function getScoreById(id: string): Score | undefined {
  return scores.find((s) => s.id === id);
}
