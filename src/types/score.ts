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
