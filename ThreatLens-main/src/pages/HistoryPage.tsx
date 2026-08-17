import { useMemo, useState } from 'react';
import { History, Trash2, Search, Inbox } from 'lucide-react';
import { useHistory } from '@/components/HistoryProvider';
import { RiskBadge } from '@/components/RiskBadge';
import { LEVEL_COLORS } from '@/lib/theme';
import type { RiskLevel } from '@/lib/types';
import { useToast } from '@/components/Toast';

type Filter = 'ALL' | RiskLevel;

const FILTERS: Filter[] = ['ALL', 'SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

function fmtDate(iso: string): string {
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
    <div className="space-y-6">
      <div className="glass-card flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-accent shadow-glow-accent">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Threat History</h1>
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
      <div className="glass-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`chip px-3 py-1.5 text-xs font-semibold transition ${
                  filter === f ? 'bg-gradient-to-r from-cyber-blue to-cyber-cyan text-white shadow-glow-cyan' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                <span className="ml-1 rounded-full bg-black/20 px-1.5 text-[10px]">{counts[f]}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scans..."
              className="w-full rounded-xl border border-white/10 bg-ink-700/60 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyber-cyan/60 focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
            />
          </div>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center gap-3 p-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5">
            <Inbox className="h-7 w-7 text-slate-500" />
          </div>
          <p className="text-sm text-slate-400">No scans match this filter.</p>
          <p className="max-w-sm text-xs text-slate-600">Run a scan from the Threat Scanner and it will appear here automatically.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Threat</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Risk Score</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const colors = LEVEL_COLORS[r.level];
                  return (
                    <tr key={r.id} className="border-b border-white/5 transition hover:bg-white/5">
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">{fmtDate(r.date)}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">{r.label}</div>
                        <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500">{r.preview}</div>
                      </td>
                      <td className="px-4 py-3"><span className="chip bg-white/5 text-slate-300">{r.type}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
                            <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: colors.hex }} />
                          </div>
                          <span className="tabular-nums text-slate-300">{r.score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><RiskBadge level={r.level} size="sm" /></td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            remove(r.id);
                            push('info', 'Scan removed');
                          }}
                          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
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
