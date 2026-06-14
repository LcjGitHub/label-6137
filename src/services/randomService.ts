import { getAllScores } from './scoreService';
import type { Score, HideMode, DifficultyLevel } from '@/types/score';

export interface RandomPracticeResult {
  score: Score;
  hideMode: HideMode;
}

const HIDE_MODES: HideMode[] = ['jianpu', 'staff'];

function randomIndex(length: number): number {
  return Math.floor(Math.random() * length);
}

export function getRandomScore(): Score {
  const scores = getAllScores();
  if (scores.length === 0) {
    throw new Error('没有可用的曲目');
  }
  return scores[randomIndex(scores.length)];
}

export function getRandomHideMode(): HideMode {
  return HIDE_MODES[randomIndex(HIDE_MODES.length)];
}

export function generateRandomPractice(
  options?: { difficulty?: DifficultyLevel; categories?: string[] },
): RandomPracticeResult {
  let scores = getAllScores();
  if (options?.difficulty) {
    scores = scores.filter((s) => s.difficulty === options.difficulty);
  }
  if (options?.categories && options.categories.length > 0) {
    scores = scores.filter((s) =>
      options.categories!.some((cat) => s.categories.includes(cat)),
    );
  }
  if (scores.length === 0) {
    scores = getAllScores();
  }
  const score = scores[randomIndex(scores.length)];
  const hideMode = HIDE_MODES[randomIndex(HIDE_MODES.length)];
  return { score, hideMode };
}
