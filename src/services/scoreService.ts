import scoresData from '@/mock/scores.json';
import type { Score, DifficultyLevel } from '@/types/score';

const scores = scoresData as Score[];

/** 获取全部曲目 */
export function getAllScores(): Score[] {
  return scores;
}

/** 按 ID 获取曲目 */
export function getScoreById(id: string): Score | undefined {
  return scores.find((s) => s.id === id);
}

/** 获取所有难度等级列表 */
export function getDifficultyLevels(): DifficultyLevel[] {
  return ['beginner', 'easy', 'medium', 'hard'];
}

/** 获取所有分类标签列表 */
export function getAllCategories(): string[] {
  const categorySet = new Set<string>();
  scores.forEach((score) => {
    score.categories.forEach((cat) => categorySet.add(cat));
  });
  return Array.from(categorySet);
}

/** 按难度和分类筛选曲目 */
export function filterScores(difficulty?: DifficultyLevel, categories?: string[]): Score[] {
  return scores.filter((score) => {
    if (difficulty && score.difficulty !== difficulty) {
      return false;
    }
    if (categories && categories.length > 0) {
      const hasCategory = categories.some((cat) => score.categories.includes(cat));
      if (!hasCategory) {
        return false;
      }
    }
    return true;
  });
}
