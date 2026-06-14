import { create } from 'zustand';
import type { PracticeRecord } from '@/types/score';
import {
  loadHistory,
  appendRecord,
  clearHistory as clearStorage,
  filterByDateRange,
  type DateRange,
} from '@/services/historyService';

/** 练习历史状态管理：基于 zustand 维护历史记录列表，同步 localStorage */

interface HistoryState {
  /** 全部练习历史记录（向后兼容：statistics 等组件仍使用 records 字段读取全部记录 */
  records: PracticeRecord[];
  /** 全部练习历史记录 */
  allRecords: PracticeRecord[];
  /** 当前选中的时间范围 */
  dateRange: DateRange;
  /** 按当前时间范围筛选后的记录 */
  filteredRecords: PracticeRecord[];
  /** 设置当前时间范围并刷新筛选结果 */
  setDateRange: (range: DateRange) => void;
  /** 新增一条练习记录并持久化 */
  addRecord: (record: PracticeRecord) => void;
  /** 清空全部练习记录及持久化数据 */
  clearAll: () => void;
  /** 从 localStorage 重新加载记录，用于页面挂载时同步 */
  refresh: () => void;
}

function getFilteredRecords(
  allRecords: PracticeRecord[],
  range: DateRange
): PracticeRecord[] {
  return filterByDateRange(allRecords, range);
}

/** 练习历史状态管理 Store */
export const useHistoryStore = create<HistoryState>((set, get) => {
  const initialRecords = loadHistory();
  return {
    records: initialRecords,
    allRecords: initialRecords,
    dateRange: 'all',
    filteredRecords: getFilteredRecords(initialRecords, 'all'),
    setDateRange: (range) => {
      const { allRecords } = get();
      set({
        dateRange: range,
        filteredRecords: getFilteredRecords(allRecords, range),
      });
    },
    addRecord: (record) => {
      appendRecord(record);
      const allRecords = loadHistory();
      const { dateRange } = get();
      set({
        records: allRecords,
        allRecords,
        filteredRecords: getFilteredRecords(allRecords, dateRange),
      });
    },
    clearAll: () => {
      clearStorage();
      set({
        records: [],
        allRecords: [],
        filteredRecords: [],
      });
    },
    refresh: () => {
      const allRecords = loadHistory();
      const { dateRange } = get();
      set({
        records: allRecords,
        allRecords,
        filteredRecords: getFilteredRecords(allRecords, dateRange),
      });
    },
  };
});
