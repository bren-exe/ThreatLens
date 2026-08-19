import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ScanRecord } from '@/lib/types';
import { clearHistory, deleteRecord, loadHistory, saveHistory } from '@/lib/history';
import { SEED_HISTORY } from '@/lib/seedData';
import { useToast } from '@/components/Toast';

interface HistoryContextValue {
  records: ScanRecord[];
  add: (record: ScanRecord) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function useHistory(): HistoryContextValue {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider');
  return ctx;
}

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const { push } = useToast();

  useEffect(() => {
    const existing = loadHistory();
    if (existing.length === 0) {
      saveHistory(SEED_HISTORY);
      setRecords(SEED_HISTORY);
    } else {
      setRecords(existing);
    }
  }, []);

  const add = useCallback((record: ScanRecord) => {
    setRecords((prev) => {
      const next = [record, ...prev].slice(0, 200);
      saveHistory(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setRecords(deleteRecord(id));
  }, []);

  const clear = useCallback(() => {
    clearHistory();
    setRecords([]);
    push('info', 'History cleared', 'All scan records have been removed.');
  }, [push]);

  const value = useMemo(() => ({ records, add, remove, clear }), [records, add, remove, clear]);

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
}
