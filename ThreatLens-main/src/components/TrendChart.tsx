import { useMemo } from 'react';
import { SEED_TREND } from '@/lib/seedData';
import { LEVEL_COLORS, levelLabel } from '@/lib/theme';
import type { RiskLevel } from '@/lib/types';

/** Animated 7-day threat detection bar chart. */
export function TrendChart() {
  const max = Math.max(...SEED_TREND.map((d) => d.scanned));
  const points = useMemo(() => {
    const w = 100;
    const h = 100;
    const stepX = w / (SEED_TREND.length - 1);
    const detectedPts = SEED_TREND.map((d, i) => `${(i * stepX).toFixed(2)},${(h - (d.detected / max) * h).toFixed(2)}`);
    const scannedPts = SEED_TREND.map((d, i) => `${(i * stepX).toFixed(2)},${(h - (d.scanned / max) * h).toFixed(2)}`);
    return { detectedPts, scannedPts };
  }, [max]);

  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="section-title">Threat Detections</h3>
          <p className="mt-0.5 text-xs text-slate-500">Last 7 days · detected vs scanned</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-cyber-cyan" /> Scanned
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="h-2 w-2 rounded-full bg-cyber-accent" /> Detected
          </span>
        </div>
      </div>

      <div className="relative h-44 w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="scanned-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
            <linearGradient id="detected-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(168,85,247,0.35)" />
              <stop offset="100%" stopColor="rgba(168,85,247,0)" />
            </linearGradient>
          </defs>
          {/* gridlines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.4" />
          ))}
          {/* scanned area */}
          <polygon
            points={`0,100 ${points.scannedPts.join(' ')} 100,100`}
            fill="url(#scanned-fill)"
            className="animate-fade-in"
          />
          <polyline
            points={points.scannedPts.join(' ')}
            fill="none"
            stroke="rgba(34,211,238,0.9)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          {/* detected area */}
          <polygon
            points={`0,100 ${points.detectedPts.join(' ')} 100,100`}
            fill="url(#detected-fill)"
            className="animate-fade-in"
          />
          <polyline
            points={points.detectedPts.join(' ')}
            fill="none"
            stroke="rgba(168,85,247,0.95)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
          />
          {/* detected dots */}
          {points.detectedPts.map((p, i) => {
            const [x, y] = p.split(',');
            return <circle key={i} cx={x} cy={y} r="1.1" fill="#a855f7" vectorEffect="non-scaling-stroke" />;
          })}
        </svg>
      </div>

      <div className="mt-2 flex justify-between px-1 text-[11px] text-slate-500">
        {SEED_TREND.map((d) => (
          <span key={d.day}>{d.day}</span>
        ))}
      </div>
    </div>
  );
}

export function RiskDistribution({ records }: { records: { level: RiskLevel }[] }) {
  const counts = useMemo(() => {
    const c: Record<RiskLevel, number> = { SAFE: 0, LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    for (const r of records) c[r.level]++;
    return c;
  }, [records]);
  const total = records.length || 1;

  const order: RiskLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'SAFE'];
  return (
    <div className="glass-card p-5">
      <h3 className="section-title">Risk Distribution</h3>
      <p className="mt-0.5 text-xs text-slate-500">Breakdown of all recorded scans</p>
      <div className="mt-4 flex flex-col gap-3">
        {order.map((lvl) => {
          const count = counts[lvl];
          const pct = (count / total) * 100;
          const colors = LEVEL_COLORS[lvl];
          return (
            <div key={lvl}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">{levelLabel(lvl)}</span>
                <span className="tabular-nums text-slate-500">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, backgroundColor: colors.hex, boxShadow: `0 0 12px ${colors.hex}66` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
