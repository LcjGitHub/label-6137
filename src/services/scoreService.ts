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

const CATEGORY_ORDER = ['儿歌', '经典', '流行', '民歌', '外国名曲', '影视', '中国风'];

/** 获取所有分类标签列表 */
export function getAllCategories(): string[] {
  const categorySet = new Set<string>();
  scores.forEach((score) => {
    score.categories.forEach((cat) => categorySet.add(cat));
  });
  const categories = Array.from(categorySet);
  return categories.sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

/** 按难度、分类和关键词筛选曲目 */
export function filterScores(difficulty?: DifficultyLevel, categories?: string[], keyword?: string): Score[] {
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
    if (keyword && keyword.trim()) {
      const trimmedKeyword = keyword.trim().toLowerCase();
      if (!score.title.toLowerCase().includes(trimmedKeyword)) {
        return false;
      }
    }
    return true;
  });
}
