import { ScanLine, ShieldCheck, TriangleAlert as AlertTriangle, Eye, Layers, ShieldAlert, Lock, ArrowRight, FileSearch, Globe, QrCode, Phone, Image, History, Chrome, ChevronRight } from 'lucide-react';
import { useRouter } from '@/components/Router';
import { Scanner } from '@/components/Scanner';
import { BatchScanner } from '@/components/BatchScanner';
import { PhishingQuiz } from '@/components/PhishingQuiz';
import { FAQ } from '@/components/FAQ';
import { RiskBadge } from '@/components/RiskBadge';
import { analyzeThreat } from '@/lib/analyzeThreat';
import { LEVEL_COLORS } from '@/lib/theme';

const CAPABILITIES = [
  { icon: Eye, title: 'Explainable Detection', desc: 'Understand why a threat was flagged — not just that it was.' },
  { icon: Layers, title: 'Multi-Format Analysis', desc: 'Analyze URLs, messages, emails, screenshots, QR codes and phone numbers.' },
  { icon: ShieldAlert, title: 'Safety Recommendations', desc: 'Know what action to take after a threat is detected.' },
  { icon: Lock, title: 'Privacy-First', desc: 'Never submit passwords, OTPs, PINs or card details. Analysis runs locally.' },
];

const SAMPLE_RESULTS = [
  {
    text: 'URGENT: Your bank account will be suspended today. Verify immediately. http://secure-bank-verify.xyz/login',
    type: 'MESSAGE' as const,
    label: 'Credential Phishing',
  },
  {
    text: 'Congratulations! You won ₹50,00,000. Pay ₹2,999 processing fee to claim your reward. Send OTP to verify.',
    type: 'MESSAGE' as const,
    label: 'UPI Scam',
  },
  {
    text: 'Your electricity bill of ₹1,240 is due on 20 August. Pay through the official electricity provider app.',
    type: 'MESSAGE' as const,
    label: 'No Threat',
  },
];

const FORENSIC_STEPS = [
  { num: '01', label: 'SUBMIT', desc: 'User submits suspicious content.' },
  { num: '02', label: 'EXTRACT', desc: 'ThreatLens extracts available security signals.' },
  { num: '03', label: 'ANALYZE', desc: 'Threat signals are evaluated against detection rules.' },
  { num: '04', label: 'ASSESS', desc: 'A risk score and category are produced.' },
  { num: '05', label: 'EXPLAIN', desc: 'AI assists with a human-readable explanation.' },
  { num: '06', label: 'ACT', desc: 'The user receives recommended safe actions.' },
];

const TOOLS = [
  { icon: ScanLine, name: 'Threat Scanner', desc: 'Analyze any suspicious content', action: 'scanner' },
  { icon: Globe, name: 'URL Scanner', desc: 'Check if a link is safe', action: 'scanner' },
  { icon: Image, name: 'Screenshot Scanner', desc: 'Upload and analyze screenshots', action: 'scanner' },
  { icon: QrCode, name: 'QR Scanner', desc: 'Decode and check QR codes', action: 'scanner' },
  { icon: Phone, name: 'Phone Checker', desc: 'Check suspicious phone numbers', action: 'scanner' },
  { icon: Chrome, name: 'Browser Extension', desc: 'Real-time browsing protection', action: 'about' },
  { icon: History, name: 'Threat History', desc: 'View past scan results', action: 'history' },
  { icon: FileSearch, name: 'Batch Scanner', desc: 'Scan multiple URLs at once', action: 'tools' },
];

const INDIA_THREATS = [
  'UPI payment scams requesting transfers to unknown numbers',
  'KYC verification scams threatening account closure',
  'Fake bank alerts asking you to verify account details',
  'Fake courier messages with malicious tracking links',
  'Fake job offers requiring upfront registration fees',
  'Fake customer support numbers on search engines',
  'QR code payment scams at shops and parking lots',
  'OTP harvesting calls pretending to be from your bank',
  'Investment scams promising guaranteed high returns',
  'Aadhaar and PAN impersonation for "verification"',
];

const HOW_IT_WORKS = [
  { num: '01', label: 'Submit', desc: 'Paste or upload suspicious content.' },
  { num: '02', label: 'Analyze', desc: 'ThreatLens evaluates available signals.' },
  { num: '03', label: 'Understand', desc: 'See the threat, evidence and explanation.' },
  { num: '04', label: 'Act', desc: 'Follow the recommended safe action.' },
];

function SampleResultCard({ text, type, label }: { text: string; type: 'MESSAGE' | 'URL'; label: string }) {
  const analysis = analyzeThreat(text, type);
  const colors = LEVEL_COLORS[analysis.level];
  return (
    <div className="surface rounded-xl p-5">
      <div className="flex items-center justify-between">
        <RiskBadge level={analysis.level} size="sm" />
        <span className="text-xs text-slate-500">SAMPLE</span>
      </div>
      <div className="mt-4 flex items-end gap-3">
        <span className="font-display text-3xl font-bold text-white tabular-nums">{analysis.score}</span>
        <span className="mb-1 text-xs text-slate-500">/ 100</span>
      </div>
      <p className={`mt-1 text-sm font-medium ${colors.text}`}>{label}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {analysis.indicators.slice(0, 3).map((ind) => (
          <span key={ind.id} className="chip bg-ink-800 text-slate-400 border border-ink-600 text-[10px]">
            {ind.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const { navigate } = useRouter();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <section className="text-center">
        <p className="section-eyebrow">Digital Threat Detection</p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          Is that link safe — or a <span className="text-gradient">trap?</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
          Analyze suspicious links, messages, emails and other digital threats before you interact with them.
        </p>
      </section>

      {/* Scanner */}
      <section className="mt-8">
        <Scanner />
      </section>

      {/* Capabilities */}
      <section className="mt-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="surface rounded-lg p-4">
                <Icon className="h-5 w-5 text-brand" />
                <p className="mt-3 text-sm font-semibold text-white">{c.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sample results */}
      <section className="mt-16">
        <p className="section-eyebrow">Sample Results</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-white">See what ThreatLens finds</h2>
        <p className="mt-1 text-sm text-slate-400">Example analyses using sample content. These are not real user statistics.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {SAMPLE_RESULTS.map((s, i) => (
            <SampleResultCard key={i} text={s.text} type={s.type} label={s.label} />
          ))}
        </div>
      </section>

      {/* Forensic analysis */}
      <section className="mt-16">
        <p className="section-eyebrow">Forensic Analysis</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-white">How ThreatLens investigates a threat</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FORENSIC_STEPS.map((step) => (
            <div key={step.num} className="surface rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="font-display text-lg font-bold text-brand">{step.num}</span>
                <span className="text-sm font-semibold text-white">{step.label}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Batch scanner */}
      <section className="mt-16">
        <BatchScanner />
      </section>

      {/* Security tools */}
      <section className="mt-16">
        <p className="section-eyebrow">Security Tools</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-white">ThreatLens Security Tools</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.name} className="surface rounded-lg p-4">
                <Icon className="h-5 w-5 text-brand" />
                <p className="mt-3 text-sm font-semibold text-white">{t.name}</p>
                <p className="mt-1 text-xs text-slate-400">{t.desc}</p>
                <button
                  onClick={() => navigate(t.action as 'scanner' | 'tools' | 'history' | 'about')}
                  className="mt-3 flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-light"
                >
                  Open <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* India digital safety */}
      <section className="mt-16">
        <p className="section-eyebrow">India Digital Safety</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-white">Built for Digital Safety in India</h2>
        <p className="mt-1 text-sm text-slate-400">ThreatLens recognizes scam patterns common across India.</p>
        <div className="mt-5 surface rounded-xl p-5">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {INDIA_THREATS.map((t, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <span className="text-sm text-slate-300">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16">
        <p className="section-eyebrow">How It Works</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-white">How ThreatLens works</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.num} className="text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand/10 border border-brand/30">
                <span className="font-display text-sm font-bold text-brand">{step.num}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-white">{step.label}</p>
              <p className="mt-1 text-xs text-slate-400">{step.desc}</p>
              {i < HOW_IT_WORKS.length - 1 && (
                <ChevronRight className="mx-auto mt-2 hidden h-4 w-4 text-slate-600 lg:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Phishing awareness quiz */}
      <section className="mt-16">
        <p className="section-eyebrow">Phishing Awareness</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-white">Test Your Phishing Awareness</h2>
        <p className="mt-1 text-sm text-slate-400">A quick interactive quiz to sharpen your scam-spotting skills.</p>
        <div className="mt-5 max-w-2xl">
          <PhishingQuiz />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <p className="section-eyebrow">FAQ</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-white">Frequently Asked Questions</h2>
        <div className="mt-5 max-w-3xl">
          <FAQ />
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16">
        <div className="surface rounded-xl p-8 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-brand" />
          <h2 className="mt-4 font-display text-xl font-semibold text-white">Ready to check a threat?</h2>
          <p className="mt-1 text-sm text-slate-400">Paste a suspicious link, message, or email and get an instant risk assessment.</p>
          <button onClick={() => navigate('scanner')} className="btn-primary mt-5">
            <ScanLine className="h-4 w-4" /> Scan a Threat
          </button>
        </div>
      </section>
    </div>
  );
}
