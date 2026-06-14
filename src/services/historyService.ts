import type { PracticeRecord } from '@/types/score';

/** 练习历史服务：负责练习记录在 localStorage 中的读取、追加与清空 */

const STORAGE_KEY = 'practice_history';

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
