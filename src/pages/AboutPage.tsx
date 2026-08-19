import { Info, User, MessageSquareText, Cpu, ScanSearch, Brain, Gauge, FileText, ShieldCheck, ArrowDown, Lock, ScanLine, Mail, Globe, Image, QrCode, Phone } from 'lucide-react';

const PIPELINE = [
  { icon: User, label: 'User' },
  { icon: MessageSquareText, label: 'Message / URL / Email' },
  { icon: Cpu, label: 'Preprocessing' },
  { icon: ScanSearch, label: 'Threat Indicator Detection' },
  { icon: Brain, label: 'AI-Assisted Analysis' },
  { icon: Gauge, label: 'Risk Scoring' },
  { icon: FileText, label: 'Explanation' },
  { icon: ShieldCheck, label: 'Safe Actions' },
];

const SCAN_TYPES = [
  { icon: Globe, label: 'URL Scanner', desc: 'Check links for suspicious domains, TLDs, and patterns.' },
  { icon: MessageSquareText, label: 'Message Scanner', desc: 'Analyze text messages for phishing and fraud indicators.' },
  { icon: Mail, label: 'Email Scanner', desc: 'Inspect email content for impersonation and credential theft.' },
  { icon: Image, label: 'Screenshot Scanner', desc: 'Upload a screenshot for text extraction and analysis.' },
  { icon: QrCode, label: 'QR Scanner', desc: 'Upload a QR code to decode and analyze its content.' },
  { icon: Phone, label: 'Phone Checker', desc: 'Check phone numbers for suspicious patterns.' },
];

const TECH = [
  'React 18 + TypeScript',
  'Vite build tool',
  'Tailwind CSS',
  'Rule-based threat detection engine',
  'Local browser storage for scan history',
  'No external API calls — runs entirely in your browser',
];

const LIMITATIONS = [
  'ThreatLens uses a rule-based engine, not a live threat-intelligence feed. It cannot guarantee a link is safe.',
  'Screenshot and QR analysis are simulated — actual OCR and QR decoding would require additional services.',
  'Phone number reputation is limited to pattern-based checks, not a live database.',
  'ThreatLens is an educational tool, not a replacement for official security channels.',
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand">
          <Info className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-white">About ThreatLens</h1>
          <p className="text-sm text-slate-400">Built to make digital safety simple.</p>
        </div>
      </div>

      {/* Intro */}
      <section className="surface rounded-xl p-6 sm:p-7">
        <span className="section-eyebrow">Mission</span>
        <h2 className="mt-3 max-w-3xl font-serif text-2xl font-medium leading-snug text-white sm:text-3xl">
          Built to make digital safety <span className="text-brand italic">simple.</span>
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          ThreatLens combines rule-based threat analysis, social engineering detection, and security
          education to help everyday users identify digital fraud before becoming victims. Paste a
          suspicious message, email, or URL — ThreatLens breaks down the indicators, explains the risk
          in plain language, and tells you what to do next.
        </p>
      </section>

      {/* The problem */}
      <section className="surface mt-6 rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-white">The Problem</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Digital scams — phishing links, UPI fraud, fake KYC messages, OTP theft — are growing rapidly.
          Most people cannot tell a suspicious link from a safe one, and scammers exploit urgency and
          fear to force quick decisions. There is a need for a simple, accessible tool that helps people
          understand threats before they act.
        </p>
      </section>

      {/* How it works */}
      <section className="surface mt-6 rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-white">How It Works</h3>
        <p className="mb-5 text-xs text-slate-500">How ThreatLens turns raw input into a safe-action recommendation.</p>
        <div className="flex flex-col items-stretch gap-1.5">
          {PIPELINE.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="contents">
                <div className="surface-2 flex items-center gap-3 rounded-xl p-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/10 border border-brand/30">
                    <Icon className="h-5 w-5 text-brand" />
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

      {/* Supported scan types */}
      <section className="surface mt-6 rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-white">Supported Investigation Types</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SCAN_TYPES.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="surface-2 rounded-lg p-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand/10 border border-brand/30">
                    <Icon className="h-4 w-4 text-brand" />
                  </div>
                  <p className="text-sm font-semibold text-white">{s.label}</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technology */}
      <section className="surface mt-6 rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-white">Technology Used</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {TECH.map((t) => (
            <span key={t} className="chip bg-ink-800 text-slate-300 border border-ink-600">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Limitations */}
      <section className="surface mt-6 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="space-y-2">
            <p className="font-display text-base font-semibold text-white">Limitations</p>
            <ul className="space-y-1.5">
              {LIMITATIONS.map((l, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="surface mt-6 rounded-xl border-warning/30 p-5">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="space-y-1.5 text-sm text-slate-300">
            <p className="font-semibold text-warning">Security & Disclaimer</p>
            <p>ThreatLens is an educational security assistant. Always verify suspicious communications through official channels.</p>
            <p className="text-slate-400">Never enter real passwords, OTPs, card numbers or sensitive personal information into this demo.</p>
          </div>
        </div>
      </section>

      {/* Hackathon purpose */}
      <section className="surface mt-6 rounded-xl p-6 text-center">
        <ScanLine className="mx-auto h-8 w-8 text-brand" />
        <h3 className="mt-3 font-display text-lg font-semibold text-white">Hackathon Project</h3>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
          ThreatLens was built as a hackathon project to demonstrate how a simple, accessible tool can
          help people understand and avoid digital threats. The analysis engine runs entirely in the
          browser — no external APIs or databases are required.
        </p>
      </section>
    </div>
  );
}
