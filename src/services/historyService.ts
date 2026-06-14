import type { PracticeRecord } from '@/types/score';

/** 练习历史服务：负责练习记录在 localStorage 中的读取、追加与清空 */

const STORAGE_KEY = 'practice_history';

/** 时间范围筛选类型 */
export type DateRange = 'today' | 'week' | 'all';

/** 提交时间的标准格式：YYYY-MM-DD HH:mm:ss */
const DATETIME_FORMAT =
  /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;

/** 将提交时间字符串解析为 Date 对象，按标准格式严格解析 */
function parseSubmittedAt(submittedAt: string): Date | null {
  const match = DATETIME_FORMAT.exec(submittedAt);
  if (!match) return null;
  const [, y, mo, d, h, mi, s] = match.map(Number);
  return new Date(y, mo - 1, d, h, mi, s);
}

/** 获取某天零时刻的 Date（本地时区） */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

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

/** 判断记录是否属于今天（自然日） */
function isToday(submittedAt: string): boolean {
  const recordDate = parseSubmittedAt(submittedAt);
  if (!recordDate) return false;
  const now = new Date();
  return (
    now.getFullYear() === recordDate.getFullYear() &&
    now.getMonth() === recordDate.getMonth() &&
    now.getDate() === recordDate.getDate()
  );
}

/** 判断记录是否属于最近七个自然日（含今天共七天） */
function isLastSevenDays(submittedAt: string): boolean {
  const recordDate = parseSubmittedAt(submittedAt);
  if (!recordDate) return false;
  const todayStart = startOfDay(new Date());
  const sixDaysAgoStart = new Date(todayStart);
  sixDaysAgoStart.setDate(todayStart.getDate() - 6);
  return recordDate >= sixDaysAgoStart;
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

/** 按时间范围从 localStorage 加载练习历史记录 */
export function loadHistoryByRange(range: DateRange): PracticeRecord[] {
  const allRecords = loadHistory();
  return filterByDateRange(allRecords, range);
}

/** 将当前时间格式化为标准提交时间字符串 YYYY-MM-DD HH:mm:ss */
export function formatNow(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}
