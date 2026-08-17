import { useState } from 'react';
import { ScanLine, Loader as Loader2, Globe } from 'lucide-react';
import { analyzeBatch, type BatchResult } from '@/lib/analyzeThreat';
import { RiskBadge } from '@/components/RiskBadge';

export function BatchScanner() {
  const [input, setInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<BatchResult[]>([]);

  const handleScan = () => {
    const urls = input.split('\n').map((u) => u.trim()).filter((u) => u.length > 0);
    if (urls.length === 0) return;
    setScanning(true);
    setResults([]);
    window.setTimeout(() => {
      setResults(analyzeBatch(urls));
      setScanning(false);
    }, 1500);
  };

  return (
    <div className="surface rounded-xl p-5 sm:p-6">
      <h2 className="font-display text-xl font-semibold text-white">Scan multiple links</h2>
      <p className="mt-1 text-sm text-slate-400">Enter one URL per line to analyze them all at once.</p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={'https://example-one.com\nhttps://example-two.com\nhttps://example-three.com'}
        className="textarea mt-4 min-h-[120px] font-mono text-xs"
        aria-label="Batch URL input"
      />

      <button onClick={handleScan} disabled={scanning} className="btn-primary mt-4">
        {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
        {scanning ? 'Scanning...' : 'Scan All'}
      </button>

      {results.length > 0 && (
        <div className="mt-5 overflow-x-auto animate-fade-in">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-600 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2 font-medium">URL</th>
                <th className="px-3 py-2 font-medium">Risk</th>
                <th className="px-3 py-2 font-medium">Score</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-b border-ink-600">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3.5 w-3.5 text-slate-500" />
                      <span className="max-w-[200px] truncate font-mono text-xs text-slate-300">{r.url}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3"><RiskBadge level={r.analysis.level} size="sm" /></td>
                  <td className="px-3 py-3 tabular-nums text-slate-300">{r.analysis.score}</td>
                  <td className="px-3 py-3 text-xs text-slate-400 capitalize">
                    {r.analysis.detectedCategories.length > 0 ? r.analysis.detectedCategories.join(', ').replace(/-/g, ' ') : 'None'}
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-500">
                    {r.analysis.level === 'SAFE' ? 'Clean' : r.analysis.level === 'LOW' ? 'Low risk' : 'Flagged'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
