import { useEffect, useMemo, useState } from 'react';
import {
  ScanLine,
  Trash2,
  Sparkles,
  AlertTriangle,
  Link2,
  KeyRound,
  Drama,
  Wallet,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  Eye,
  Network,
  Calculator,
  Brain,
} from 'lucide-react';
import { analyzeThreat, DEMO_EXAMPLES } from '@/lib/analyzeThreat';
import type { Indicator, IndicatorSeverity, ScanType, ThreatAnalysis } from '@/lib/types';
import { useHistory } from '@/components/HistoryProvider';
import { useDemo } from '@/components/DemoProvider';
import { useToast } from '@/components/Toast';
import { RiskMeter } from '@/components/RiskMeter';
import { RiskBadge } from '@/components/RiskBadge';
import { LEVEL_COLORS, SEVERITY_COLORS } from '@/lib/theme';
import { uid } from '@/lib/history';

const TABS: { id: ScanType; label: string }[] = [
  { id: 'MESSAGE', label: 'Message' },
  { id: 'EMAIL', label: 'Email' },
  { id: 'URL', label: 'URL' },
];

const SCAN_STEPS = [
  { icon: Eye, label: 'Analyzing content...' },
  { icon: Network, label: 'Checking threat indicators...' },
  { icon: Brain, label: 'Analyzing social engineering patterns...' },
  { icon: Link2, label: 'Evaluating URL reputation...' },
  { icon: Calculator, label: 'Calculating threat score...' },
];

const INDICATOR_ICONS: Record<string, typeof AlertTriangle> = {
  'otp-request': KeyRound,
  'password-request': KeyRound,
  'bank-card-request': Wallet,
  'financial-payment': Wallet,
  'prize-scam': Sparkles,
  urgency: Clock,
  'account-suspension': AlertTriangle,
  impersonation: Drama,
  'suspicious-url': Link2,
  'http-url': Link2,
  'url-shortener': Link2,
  'suspicious-domain': Link2,
  'unrealistic-offer': Sparkles,
  'personal-info-request': KeyRound,
  'grammar-oddity': AlertTriangle,
  'support-impersonation': Drama,
};

function severityRank(s: IndicatorSeverity): number {
  return { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 }[s];
}

function ScanAnimation() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setStep((s) => (s + 1) % SCAN_STEPS.length), 520);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="glass-card relative overflow-hidden p-8">
      <div className="absolute inset-0 grid-bg-anim opacity-30" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-cyan/60 to-transparent animate-scan-line" />
      <div className="relative flex flex-col items-center gap-5">
        <div className="relative grid h-20 w-20 place-items-center">
          <span className="absolute inset-0 rounded-full border border-cyber-cyan/30 animate-pulse-ring" />
          <span className="absolute inset-0 rounded-full border border-cyber-accent/20 animate-pulse-ring" style={{ animationDelay: '0.4s' }} />
          <div className="grid h-16 w-16 place-items-center rounded-full bg-cyber-cyan/10 ring-1 ring-cyber-cyan/40">
            <Cpu className="h-7 w-7 animate-spin text-cyber-cyan" style={{ animationDuration: '2.5s' }} />
          </div>
        </div>
        <div className="w-full max-w-sm space-y-2">
          {SCAN_STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div
                key={s.label}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 ${
                  active ? 'bg-cyber-cyan/10 text-cyber-cyan' : done ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'animate-pulse' : ''}`} />
                <span>{s.label}</span>
                {active && <span className="ml-auto flex gap-1"><span className="h-1 w-1 animate-pulse rounded-full bg-cyber-cyan" /><span className="h-1 w-1 animate-pulse rounded-full bg-cyber-cyan" style={{ animationDelay: '0.2s' }} /><span className="h-1 w-1 animate-pulse rounded-full bg-cyber-cyan" style={{ animationDelay: '0.4s' }} /></span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function IndicatorRow({ indicator }: { indicator: Indicator }) {
  const Icon = INDICATOR_ICONS[indicator.id] ?? AlertTriangle;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3 animate-fade-in">
      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${SEVERITY_COLORS[indicator.severity]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-200">{indicator.label}</p>
          <span className={`chip ${SEVERITY_COLORS[indicator.severity]} text-[10px] font-semibold`}>{indicator.severity}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">{indicator.detail}</p>
      </div>
    </div>
  );
}

function BreakdownBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="tabular-nums text-slate-400">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}55` }}
        />
      </div>
    </div>
  );
}

function ResultCard({ analysis, input }: { analysis: ThreatAnalysis; input: string }) {
  const [showActions, setShowActions] = useState(false);
  const colors = LEVEL_COLORS[analysis.level];
  const sortedIndicators = useMemo(
    () => [...analysis.indicators].sort((a, b) => severityRank(b.severity) - severityRank(a.severity)),
    [analysis.indicators],
  );

  return (
    <div className="space-y-4 animate-scale-in">
      {/* Main result */}
      <div className={`glass-card relative overflow-hidden p-6 ${colors.glow}`}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
          <RiskMeter score={analysis.score} level={analysis.level} size={180} />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <AlertTriangle className={`h-5 w-5 ${colors.text}`} />
              <span className={`font-display text-xl font-bold ${colors.text}`}>{analysis.level === 'SAFE' ? 'No Threat Detected' : `${analysis.level} RISK`}</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">Risk Score · {analysis.score} / 100</p>
            <div className="mt-4 rounded-xl border border-white/5 bg-ink-700/50 p-4">
              <p className="label mb-1.5 flex items-center gap-1.5"><Brain className="h-3.5 w-3.5" /> AI Analysis</p>
              <p className="text-sm leading-relaxed text-slate-300">{analysis.explanation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      {sortedIndicators.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="section-title mb-1">Threat Indicators Detected</h3>
          <p className="mb-4 text-xs text-slate-500">{sortedIndicators.length} indicator{sortedIndicators.length !== 1 ? 's' : ''} found in this content</p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {sortedIndicators.map((ind) => (
              <IndicatorRow key={ind.id} indicator={ind} />
            ))}
          </div>
        </div>
      )}

      {/* Risk breakdown */}
      <div className="glass-card p-5">
        <h3 className="section-title mb-4">Risk Breakdown</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <BreakdownBar label="Social Engineering" value={analysis.breakdown.socialEngineering} color="#a855f7" />
          <BreakdownBar label="URL Risk" value={analysis.breakdown.urlRisk} color="#22d3ee" />
          <BreakdownBar label="Credential Risk" value={analysis.breakdown.credentialRisk} color="#fb923c" />
          <BreakdownBar label="Financial Risk" value={analysis.breakdown.financialRisk} color="#f43f5e" />
        </div>
      </div>

      {/* Safe actions */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="section-title">What Should You Do?</h3>
            <p className="mt-0.5 text-xs text-slate-500">Recommended safe actions based on the analysis</p>
          </div>
          <button
            onClick={() => setShowActions((v) => !v)}
            className="btn bg-emerald-500/15 px-4 py-2.5 text-sm text-emerald-300 ring-1 ring-emerald-500/30 hover:bg-emerald-500/25"
          >
            <ShieldCheck className="h-4 w-4" />
            {showActions ? 'Hide Safe Actions' : 'Show Safe Actions'}
            {showActions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        {showActions && (
          <ul className="mt-4 space-y-2.5 animate-fade-in">
            {analysis.recommendations.length === 0 ? (
              <li className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-200">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                No action needed — this content appears safe. Stay alert and keep good security habits.
              </li>
            ) : (
              analysis.recommendations.map((r) => (
                <li key={r.id} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-sm text-slate-300 animate-fade-in">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  {r.text}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Analyzed content */}
      <div className="glass-card p-5">
        <p className="label mb-2">Analyzed Content</p>
        <p className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded-xl border border-white/5 bg-ink-700/50 p-3 text-sm text-slate-400">
          {input}
        </p>
      </div>
    </div>
  );
}

export function ScannerPage() {
  const [tab, setTab] = useState<ScanType>('MESSAGE');
  const [input, setInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ThreatAnalysis | null>(null);
  const [scannedInput, setScannedInput] = useState('');
  const { add } = useHistory();
  const { demoActive, demoPayload, endDemo } = useDemo();
  const { push } = useToast();

  // Live demo mode: auto-load + auto-scan
  useEffect(() => {
    if (!demoActive || !demoPayload) return;
    setTab(demoPayload.type);
    setInput(demoPayload.text);
    setScannedInput(demoPayload.text);
    setScanning(true);
    setResult(null);
    const t = window.setTimeout(() => {
      const analysis = analyzeThreat(demoPayload.text, demoPayload.type);
      setResult(analysis);
      setScanning(false);
      const record = {
        id: uid(),
        date: new Date().toISOString(),
        label: demoLabel(demoPayload.text),
        type: demoPayload.type,
        score: analysis.score,
        level: analysis.level,
        preview: demoPayload.text.slice(0, 80),
      };
      add(record);
      endDemo();
    }, 2800);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoActive, demoPayload]);

  const handleScan = () => {
    if (!input.trim()) {
      push('warning', 'Nothing to scan', 'Paste a message, email or URL first.');
      return;
    }
    setScanning(true);
    setResult(null);
    setScannedInput(input);
    window.setTimeout(() => {
      const analysis = analyzeThreat(input, tab);
      setResult(analysis);
      setScanning(false);
      const record = {
        id: uid(),
        date: new Date().toISOString(),
        label: demoLabel(input),
        type: tab,
        score: analysis.score,
        level: analysis.level,
        preview: input.slice(0, 80),
      };
      add(record);
      push(
        analysis.level === 'SAFE' ? 'success' : analysis.level === 'LOW' ? 'info' : 'warning',
        `Scan complete · ${analysis.level}`,
        `Risk score ${analysis.score}/100`,
      );
    }, 2600);
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setScannedInput('');
  };

  const loadExample = (key: keyof typeof DEMO_EXAMPLES) => {
    const ex = DEMO_EXAMPLES[key];
    setTab(ex.type);
    setInput(ex.text);
    setResult(null);
    push('info', `${ex.label} loaded`, 'Press Scan Threat to analyze it.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-cyan shadow-glow-cyan">
            <ScanLine className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">AI Threat Scanner</h1>
            <p className="text-sm text-slate-400">Analyze suspicious messages, emails and URLs before you interact with them.</p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="glass-card p-5">
        {/* Tabs */}
        <div className="mb-4 inline-flex rounded-xl border border-white/5 bg-ink-700/50 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
                tab === t.id ? 'bg-gradient-to-r from-cyber-blue to-cyber-cyan text-white shadow-glow-cyan' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a suspicious message, email or URL here..."
          maxLength={2000}
          className="input-area h-40"
          aria-label="Threat input"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
          <span>{input.length} / 2000 characters</span>
          <span className="hidden sm:inline">Tip: try a demo example below</span>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={handleScan} disabled={scanning} className="btn-primary">
            <ScanLine className="h-4 w-4" /> {scanning ? 'Scanning...' : 'Scan Threat'}
          </button>
          <button onClick={handleClear} disabled={scanning} className="btn-ghost">
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>

        {/* Demo buttons */}
        <div className="mt-5 border-t border-white/5 pt-4">
          <p className="label mb-2.5">Quick demo examples</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => loadExample('phishing')} className="btn-ghost text-xs">
              <AlertTriangle className="h-3.5 w-3.5 text-orange-300" /> Try Phishing Example
            </button>
            <button onClick={() => loadExample('scam')} className="btn-ghost text-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Try Scam Example
            </button>
            <button onClick={() => loadExample('otp')} className="btn-ghost text-xs">
              <KeyRound className="h-3.5 w-3.5 text-red-300" /> Try OTP Example
            </button>
            <button onClick={() => loadExample('safe')} className="btn-ghost text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Try Safe Example
            </button>
          </div>
        </div>
      </div>

      {/* Scan animation / result / empty */}
      {scanning ? (
        <ScanAnimation />
      ) : result ? (
        <ResultCard analysis={result} input={scannedInput} />
      ) : (
        <div className="glass-card flex flex-col items-center justify-center gap-3 p-12 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/5">
            <ScanLine className="h-7 w-7 text-slate-500" />
          </div>
          <p className="text-sm text-slate-400">Ready to scan. Paste content above and press <span className="font-semibold text-cyber-cyan">Scan Threat</span>.</p>
          <p className="max-w-md text-xs text-slate-600">Never enter real passwords, OTPs, card numbers or sensitive personal information into this demo.</p>
        </div>
      )}
    </div>
  );
}

function demoLabel(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('otp')) return 'OTP harvesting';
  if (t.includes('congratulations') || t.includes('won')) return 'Prize scam';
  if (t.includes('suspend') || t.includes('bank')) return 'Bank impersonation';
  if (t.includes('bill') || t.includes('electricity')) return 'Verified notification';
  if (t.includes('http')) return 'Suspicious link';
  return 'Scanned content';
}
