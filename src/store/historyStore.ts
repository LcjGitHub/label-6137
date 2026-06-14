import { create } from 'zustand';
import type { PracticeRecord } from '@/types/score';
import {
  loadHistory,
  appendRecord,
  clearHistory as clearStorage,
} from '@/services/historyService';

/** 练习历史状态管理：基于 zustand 维护历史记录列表，同步 localStorage */

interface HistoryState {
  /** 全部练习历史记录 */
  records: PracticeRecord[];
  /** 新增一条练习记录并持久化 */
  addRecord: (record: PracticeRecord) => void;
  /** 清空全部练习记录及持久化数据 */
  clearAll: () => void;
  /** 从 localStorage 重新加载记录，用于页面挂载时同步 */
  refresh: () => void;
}

/** 练习历史状态管理 Store */
export const useHistoryStore = create<HistoryState>((set) => ({
  records: loadHistory(),
  addRecord: (record) => {
    appendRecord(record);
    set({ records: loadHistory() });
  },
  clearAll: () => {
    clearStorage();
    set({ records: [] });
  },
  refresh: () => {
    set({ records: loadHistory() });
  },
}));
