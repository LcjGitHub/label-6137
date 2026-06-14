import { create } from 'zustand';
import type { PracticeRecord } from '@/types/score';
import {
  loadHistory,
  appendRecord,
  clearHistory as clearStorage,
} from '@/services/historyService';

interface HistoryState {
  records: PracticeRecord[];
  addRecord: (record: PracticeRecord) => void;
  clearAll: () => void;
  refresh: () => void;
}

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
