import type { PracticeRecord } from '@/types/score';

/** 单首曲目的练习统计排行信息 */
export interface ScorePracticeRank {
  /** 曲目标题 */
  scoreTitle: string;
  /** 该曲目被练习的总次数 */
  practiceCount: number;
  /** 该曲目答对的次数 */
  correctCount: number;
  /** 该曲目的正确率（0-100，保留两位小数） */
  accuracy: number;
}

/** 学习统计整体数据结构 */
export interface StatisticsData {
  /** 全部练习的总次数 */
  totalPracticeCount: number;
  /** 全部练习中答对的次数 */
  correctCount: number;
  /** 整体正确率（0-100，保留两位小数） */
  accuracy: number;
  /** 各曲目按练习次数降序排列的统计列表 */
  scoreRankings: ScorePracticeRank[];
}

/**
 * 根据练习历史记录计算整体学习统计数据。
 *
 * 统计内容包括：
 * - 总练习次数、答对次数、整体正确率
 * - 按曲目维度聚合的练习次数、答对次数、正确率，并按练习次数降序排序
 *
 * @param records - 练习历史记录数组，来源于 localStorage 中的练习记录
 * @returns 汇总后的统计数据对象，若无记录则数值均为 0、排行列表为空
 */
export function calculateStatistics(records: PracticeRecord[]): StatisticsData {
  const totalPracticeCount = records.length;
  const correctCount = records.filter((r) => r.correct).length;
  const accuracy =
    totalPracticeCount > 0 ? Math.round((correctCount / totalPracticeCount) * 10000) / 100 : 0;

  const scoreMap = new Map<
    string,
    { practiceCount: number; correctCount: number }
  >();

  records.forEach((record) => {
    const existing = scoreMap.get(record.scoreTitle) ?? {
      practiceCount: 0,
      correctCount: 0,
    };
    existing.practiceCount += 1;
    if (record.correct) {
      existing.correctCount += 1;
    }
    scoreMap.set(record.scoreTitle, existing);
  });

  const scoreRankings: ScorePracticeRank[] = Array.from(
    scoreMap.entries()
  ).map(([scoreTitle, stats]) => ({
    scoreTitle,
    practiceCount: stats.practiceCount,
    correctCount: stats.correctCount,
    accuracy:
      stats.practiceCount > 0
        ? Math.round((stats.correctCount / stats.practiceCount) * 10000) / 100
        : 0,
  }));

  scoreRankings.sort((a, b) => b.practiceCount - a.practiceCount);

  return {
    totalPracticeCount,
    correctCount,
    accuracy,
    scoreRankings,
  };
}
