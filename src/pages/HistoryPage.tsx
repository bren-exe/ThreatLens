import { useMemo, useState } from 'react';
import { Factory as History, Trash2, Search, Inbox } from 'lucide-react';
import { useHistory } from '@/components/HistoryProvider';
import { RiskBadge } from '@/components/RiskBadge';
import { LEVEL_COLORS } from '@/lib/theme';
import type { RiskLevel } from '@/lib/types';
import { useToast } from '@/components/Toast';

type Filter = 'ALL' | RiskLevel;

const FILTERS: Filter[] = ['ALL', 'SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function HistoryPage() {
  const { records, remove, clear } = useHistory();
  const { push } = useToast();
  const [filter, setFilter] = useState<Filter>('ALL');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filter !== 'ALL' && r.level !== filter) return false;
      if (query && !r.label.toLowerCase().includes(query.toLowerCase()) && !r.preview.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [records, filter, query]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { ALL: records.length, SAFE: 0, LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    for (const r of records) c[r.level]++;
    return c;
  }, [records]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">Scan History</h1>
            <p className="text-sm text-slate-400">All scans are saved locally on this device.</p>
          </div>
        </div>
        {records.length > 0 && (
          <button
            onClick={() => {
              clear();
              push('info', 'History cleared');
            }}
            className="btn-ghost text-xs"
          >
            <Trash2 className="h-3.5 w-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="surface rounded-xl p-4 mb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`chip px-3 py-1.5 text-xs font-semibold transition ${
                  filter === f ? 'bg-brand text-white' : 'bg-ink-800 text-slate-400 border border-ink-600 hover:text-white'
                }`}
              >
                {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                <span className="ml-1 rounded bg-black/20 px-1 text-[10px]">{counts[f]}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scans..."
              className="input pl-9 py-2"
              aria-label="Search scan history"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="surface rounded-xl flex flex-col items-center justify-center gap-3 p-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-xl bg-ink-800">
            <Inbox className="h-7 w-7 text-slate-500" />
          </div>
          <p className="text-sm text-slate-400">No scans match this filter.</p>
          <p className="max-w-sm text-xs text-slate-600">Run a scan from the Threat Scanner and it will appear here automatically.</p>
        </div>
      ) : (
        <div className="surface rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-600 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Threat</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Risk</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const colors = LEVEL_COLORS[r.level];
                  return (
                    <tr key={r.id} className="border-b border-ink-600 transition hover:bg-ink-800/50">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">{fmtTime(r.date)}</td>
                      <td className="px-4 py-3"><span className="chip bg-ink-800 text-slate-300 border border-ink-600">{r.type}</span></td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">{r.label}</div>
                        <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500">{r.preview}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">—</td>
                      <td className="px-4 py-3"><RiskBadge level={r.level} size="sm" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-14 overflow-hidden rounded-full bg-ink-700">
                            <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: colors.hex }} />
                          </div>
                          <span className="tabular-nums text-slate-300">{r.score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            remove(r.id);
                            push('info', 'Scan removed');
                          }}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-critical/10 hover:text-critical"
                          aria-label="Delete scan record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
