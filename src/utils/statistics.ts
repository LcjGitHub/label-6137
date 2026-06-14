import type { PracticeRecord } from '@/types/score';

export interface ScorePracticeRank {
  scoreTitle: string;
  practiceCount: number;
  correctCount: number;
  accuracy: number;
}

export interface StatisticsData {
  totalPracticeCount: number;
  correctCount: number;
  accuracy: number;
  scoreRankings: ScorePracticeRank[];
}

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
