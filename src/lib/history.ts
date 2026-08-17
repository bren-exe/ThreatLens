import type { ScanRecord } from './types';

const KEY = 'threatlens.history.v1';

export function loadHistory(): ScanRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ScanRecord[];
  } catch {
    return [];
  }
}

export function saveHistory(records: ScanRecord[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(records.slice(0, 200)));
  } catch {
    // ignore quota errors
  }
}

export function addScanRecord(record: ScanRecord): ScanRecord[] {
  const existing = loadHistory();
  const next = [record, ...existing].slice(0, 200);
  saveHistory(next);
  return next;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function deleteRecord(id: string): ScanRecord[] {
  const next = loadHistory().filter((r) => r.id !== id);
  saveHistory(next);
  return next;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
