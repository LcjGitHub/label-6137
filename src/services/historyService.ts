import type { PracticeRecord } from '@/types/score';

/** 练习历史服务：负责练习记录在 localStorage 中的读取、追加与清空 */

const STORAGE_KEY = 'practice_history';

/** 时间范围筛选类型 */
export type DateRange = 'today' | 'week' | 'all';

/** 从 localStorage 加载全部练习历史记录 */
export function loadHistory(): PracticeRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** 将全部练习历史记录写入 localStorage */
export function saveHistory(records: PracticeRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/** 追加一条练习记录到 localStorage（插入到列表头部） */
export function appendRecord(record: PracticeRecord): void {
  const records = loadHistory();
  records.unshift(record);
  saveHistory(records);
}

/** 清空 localStorage 中的全部练习历史记录 */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** 判断记录是否属于今天 */
function isToday(submittedAt: string): boolean {
  const now = new Date();
  const recordDate = new Date(submittedAt);
  return (
    now.getFullYear() === recordDate.getFullYear() &&
    now.getMonth() === recordDate.getMonth() &&
    now.getDate() === recordDate.getDate()
  );
}

/** 判断记录是否属于最近七天 */
function isLastSevenDays(submittedAt: string): boolean {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  const recordDate = new Date(submittedAt);
  return recordDate >= sevenDaysAgo && recordDate <= now;
}

/** 按时间范围筛选练习记录 */
export function filterByDateRange(
  records: PracticeRecord[],
  range: DateRange
): PracticeRecord[] {
  switch (range) {
    case 'today':
      return records.filter((r) => isToday(r.submittedAt));
    case 'week':
      return records.filter((r) => isLastSevenDays(r.submittedAt));
    case 'all':
    default:
      return records;
  }
}

/** 按时间范围加载练习历史记录 */
export function loadHistoryByRange(range: DateRange): PracticeRecord[] {
  const allRecords = loadHistory();
  return filterByDateRange(allRecords, range);
}
