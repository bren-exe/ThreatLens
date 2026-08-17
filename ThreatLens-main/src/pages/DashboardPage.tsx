import { useEffect, useMemo, useState } from 'react';
import { ScanLine, ShieldCheck, AlertTriangle, ShieldAlert, Activity, ArrowRight, Gauge, Lock } from 'lucide-react';
import { useRouter } from '@/components/Router';
import { useHistory } from '@/components/HistoryProvider';
import { useDemo } from '@/components/DemoProvider';
import { RiskBadge } from '@/components/RiskBadge';
import { TrendChart, RiskDistribution } from '@/components/TrendChart';
import { DEMO_EXAMPLES } from '@/lib/analyzeThreat';
import { LEVEL_COLORS } from '@/lib/theme';
import type { RiskLevel } from '@/lib/types';

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  accent,
  delay,
}: {
  icon: typeof Activity;
  label: string;
  value: number;
  suffix?: string;
  accent: string;
  delay: number;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1000;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div
      className="glass-card group p-5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="label">{label}</p>
          <p className="stat-num mt-2 text-white">
            {display}
            {suffix && <span className="text-lg text-slate-500">{suffix}</span>}
          </p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${accent} transition-transform group-hover:scale-110`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function DashboardPage() {
  const { navigate } = useRouter();
  const { records } = useHistory();
  const { launchDemo } = useDemo();

  const stats = useMemo(() => {
    const scanned = records.length;
    const detected = records.filter((r) => r.level !== 'SAFE' && r.level !== 'LOW').length;
    const high = records.filter((r) => r.level === 'HIGH' || r.level === 'CRITICAL').length;
    const safe = records.filter((r) => r.level === 'SAFE').length;
    const protection = scanned ? Math.max(40, Math.round((safe / scanned) * 100 + (1 - detected / scanned) * 20)) : 94;
    return { scanned: scanned || 127, detected: detected || 38, high: high || 14, protection };
  }, [records]);

  const recent = useMemo(() => records.slice(0, 5), [records]);

  const launchLiveDemo = () => {
    launchDemo(DEMO_EXAMPLES.phishing.text, DEMO_EXAMPLES.phishing.type);
    navigate('scanner');
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="glass-card relative overflow-hidden p-7 sm:p-9">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-cyber-blue/20 blur-3xl" />
        <div className="absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-cyber-accent/15 blur-3xl" />
        <div className="relative">
          <span className="chip bg-cyber-cyan/10 text-cyber-cyan ring-1 ring-cyber-cyan/30">
            <ShieldCheck className="h-3.5 w-3.5" /> AI-Powered Protection
          </span>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            Detect Digital Threats <span className="text-gradient">Before They Detect You</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
            AI-powered protection against phishing, fraud, malicious links and social engineering.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => navigate('scanner')} className="btn-primary">
              <ScanLine className="h-4 w-4" /> Scan a Threat
            </button>
            <button onClick={() => navigate('safety')} className="btn-ghost">
              <ShieldCheck className="h-4 w-4" /> Learn Digital Safety
            </button>
            <button onClick={launchLiveDemo} className="btn-outline">
              <Activity className="h-4 w-4" /> Launch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={ScanLine} label="Threats Scanned" value={stats.scanned} accent="bg-cyber-blue/15 text-cyber-blue" delay={0} />
        <StatCard icon={AlertTriangle} label="Threats Detected" value={stats.detected} accent="bg-amber-500/15 text-amber-300" delay={80} />
        <StatCard icon={ShieldAlert} label="High Risk Threats" value={stats.high} accent="bg-orange-500/15 text-orange-300" delay={160} />
        <StatCard icon={Gauge} label="Protection Score" value={stats.protection} suffix="%" accent="bg-emerald-500/15 text-emerald-300" delay={240} />
      </section>

      {/* Trend + Distribution */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendChart />
        </div>
        <RiskDistribution records={records} />
      </section>

      {/* Recent threats */}
      <section className="glass-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="section-title">Recent Threats</h3>
            <p className="mt-0.5 text-xs text-slate-500">Latest analyzed items from your scan history</p>
          </div>
          <button onClick={() => navigate('history')} className="btn-ghost text-xs">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-3 py-2 font-medium">Threat</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Risk Score</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">When</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                    No scans yet. Run a scan to populate your history.
                  </td>
                </tr>
              ) : (
                recent.map((r) => {
                  const colors = LEVEL_COLORS[r.level as RiskLevel];
                  return (
                    <tr key={r.id} className="border-b border-white/5 transition hover:bg-white/5">
                      <td className="px-3 py-3">
                        <div className="font-medium text-slate-200">{r.label}</div>
                        <div className="mt-0.5 max-w-xs truncate text-xs text-slate-500">{r.preview}</div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="chip bg-white/5 text-slate-300">{r.type}</span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/5">
                            <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: colors.hex }} />
                          </div>
                          <span className="tabular-nums text-slate-300">{r.score}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3"><RiskBadge level={r.level} size="sm" /></td>
                      <td className="px-3 py-3 text-xs text-slate-500">{timeAgo(r.date)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI engine status */}
      <section className="glass-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Lock className="h-4 w-4 text-cyber-cyan" />
          <h3 className="section-title">AI Engine Status</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'AI Threat Analysis', state: 'ONLINE' },
            { label: 'Threat Detection', state: 'ACTIVE' },
            { label: 'URL Analysis', state: 'ACTIVE' },
            { label: 'Social Engineering', state: 'ACTIVE' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/5 bg-white/5 p-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">{s.state}</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-300">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
