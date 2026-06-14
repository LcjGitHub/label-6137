/** 曲目数据类型 */
export interface Score {
  id: string;
  title: string;
  jianpuText: string;
  staffSvgPath: string;
  noteArray: string[];
}

/** 练习隐藏模式 */
export type HideMode = 'jianpu' | 'staff';

/** 练习历史记录：记录每次练习提交的曲目、模式、结果与时间 */
export interface PracticeRecord {
  id: string;
  scoreTitle: string;
  hideMode: HideMode;
  correct: boolean;
  submittedAt: string;
}
