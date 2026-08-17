import { Info, User, MessageSquareText, Cpu, ScanSearch, Brain, Gauge, FileText, ShieldCheck, ArrowDown, Lock, Server, Sparkles } from 'lucide-react';

const PIPELINE = [
  { icon: User, label: 'User' },
  { icon: MessageSquareText, label: 'Message / URL' },
  { icon: Cpu, label: 'Preprocessing' },
  { icon: ScanSearch, label: 'Threat Indicator Detection' },
  { icon: Brain, label: 'AI Analysis Engine' },
  { icon: Gauge, label: 'Risk Scoring' },
  { icon: FileText, label: 'Explanation' },
  { icon: ShieldCheck, label: 'Safe Actions' },
];

const ENGINE_STATUS = [
  { label: 'AI Threat Analysis', state: 'ONLINE' },
  { label: 'Threat Detection', state: 'ACTIVE' },
  { label: 'URL Analysis', state: 'ACTIVE' },
  { label: 'Social Engineering Detection', state: 'ACTIVE' },
];

export function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card flex items-center gap-2.5 p-6">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-accent shadow-glow-accent">
          <Info className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">About CyberShield</h1>
          <p className="text-sm text-slate-400">Built to make digital safety simple.</p>
        </div>
      </div>

      {/* Intro */}
      <section className="glass-card relative overflow-hidden p-7">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyber-accent/15 blur-3xl" />
        <div className="relative">
          <span className="chip bg-cyber-cyan/10 text-cyber-cyan ring-1 ring-cyber-cyan/30">
            <Sparkles className="h-3.5 w-3.5" /> Mission
          </span>
          <h2 className="mt-4 max-w-3xl font-display text-2xl font-bold leading-snug text-white sm:text-3xl">
            Built to make digital safety <span className="text-gradient">simple.</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            CyberShield combines AI-assisted threat analysis, social engineering detection and security education to help
            everyday users identify digital fraud before becoming victims. Paste a suspicious message, email or URL —
            CyberShield breaks down the indicators, explains the risk in plain language, and tells you what to do next.
          </p>
        </div>
      </section>

      {/* AI engine status */}
      <section className="glass-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Server className="h-4 w-4 text-cyber-cyan" />
          <h3 className="section-title">AI Engine Status</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ENGINE_STATUS.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/5 bg-white/5 p-4">
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
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p className="text-xs leading-relaxed text-amber-200/90">
            This hackathon MVP uses a <span className="font-semibold">local analysis engine</span> running entirely in your
            browser. It is architected so that a real LLM/API and external threat-intelligence services can be connected
            later by replacing the <code className="rounded bg-black/30 px-1">analyzeThreat()</code> function — no UI changes
            required. CyberShield does not claim to be connected to a real external threat-intelligence service.
          </p>
        </div>
      </section>

      {/* Architecture diagram */}
      <section className="glass-card p-6">
        <h3 className="section-title mb-1">Analysis Pipeline</h3>
        <p className="mb-5 text-xs text-slate-500">How CyberShield turns raw input into a safe-action recommendation.</p>
        <div className="flex flex-col items-stretch gap-1.5">
          {PIPELINE.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="contents">
                <div
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-ink-700/50 p-3.5 transition hover:border-cyber-cyan/30 hover:bg-white/5 animate-slide-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyber-blue/20 to-cyber-accent/20 ring-1 ring-white/10 transition group-hover:scale-110">
                    <Icon className="h-5 w-5 text-cyber-cyan" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-200">{step.label}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">{String(i + 1).padStart(2, '0')}</span>
                </div>
                {i < PIPELINE.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <ArrowDown className="h-4 w-4 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="glass-card border-amber-500/20 p-5">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <div className="space-y-1.5 text-sm text-slate-300">
            <p className="font-semibold text-amber-200">Security & Disclaimer</p>
            <p>CyberShield is an educational security assistant. Always verify suspicious communications through official channels.</p>
            <p className="text-slate-400">Never enter real passwords, OTPs, card numbers or sensitive personal information into this demo.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
