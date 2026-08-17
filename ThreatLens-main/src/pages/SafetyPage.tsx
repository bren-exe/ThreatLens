import { useState } from 'react';
import {
  ShieldQuestion,
  Mail,
  Globe,
  KeyRound,
  Drama,
  ShoppingCart,
  Lock,
  Hand,
  SearchCheck,
  Share2,
  Link2,
  Flag,
  ChevronDown,
} from 'lucide-react';

const TOPICS = [
  {
    id: 'phishing',
    icon: Mail,
    title: 'Phishing',
    color: 'from-cyber-blue to-cyber-cyan',
    summary: 'How to recognize fake messages and emails.',
    body: [
      'Phishing messages pretend to be from a trusted source — your bank, a delivery service, a government office — to trick you into clicking a link or sharing details.',
      'Watch for: a generic greeting (“Dear Customer”), urgent language, a link that looks almost right but isn’t, and requests for account or payment information.',
      'If in doubt, do not click. Open the official app or type the website address yourself.',
    ],
  },
  {
    id: 'fake-websites',
    icon: Globe,
    title: 'Fake Websites',
    color: 'from-cyber-cyan to-emerald-400',
    summary: 'How to identify suspicious domains and URLs.',
    body: [
      'Scammers register look-alike domains (paypa1.com, amaz0n.in) or use unusual endings (.zip, .xyz, .click) to imitate real brands.',
      'Check the full URL carefully before entering any information. Look for https:// and a valid certificate, but remember: a padlock only means the connection is encrypted — not that the site is honest.',
      'Shortened links (bit.ly, tinyurl) hide the real destination. Expand them with a preview tool before clicking.',
    ],
  },
  {
    id: 'otp',
    icon: KeyRound,
    title: 'OTP Safety',
    color: 'from-amber-400 to-orange-500',
    summary: 'Never share OTPs with anyone.',
    body: [
      'A one-time password (OTP) is the last line of defense for your account. Legitimate customer support will never ask for it.',
      'If someone — even claiming to be from your bank or a police officer — asks you to read out an OTP, end the conversation immediately.',
      'Treat every OTP like your ATM PIN. No one has a valid reason to ask for it.',
    ],
  },
  {
    id: 'social-engineering',
    icon: Drama,
    title: 'Social Engineering',
    color: 'from-cyber-accent to-cyber-blue',
    summary: 'Recognize manipulation and urgency tactics.',
    body: [
      'Social engineering attacks exploit emotion — fear, greed, curiosity, or the desire to help — instead of technology.',
      'Common patterns: “Your account will be suspended”, “You’ve won a prize”, “A family member is in trouble”, “Verify your identity now”. Each one pressures you to act before you think.',
      'Slow down. Verify through an official channel. A real organization will not mind you taking a moment to confirm.',
    ],
  },
  {
    id: 'shopping',
    icon: ShoppingCart,
    title: 'Online Shopping Scams',
    color: 'from-orange-400 to-red-500',
    summary: 'Identify fake offers and payment traps.',
    body: [
      'Fake stores advertise impossibly low prices on popular products, then never ship them — or worse, harvest your card details at checkout.',
      'Check for reviews outside the site, a real return policy, and a secure payment page. Be wary of “pay by UPI to this number” for a product listing.',
      'If a deal seems too good to be true, it almost certainly is.',
    ],
  },
  {
    id: 'account-security',
    icon: Lock,
    title: 'Account Security',
    color: 'from-emerald-400 to-cyber-cyan',
    summary: 'Protect passwords and enable MFA.',
    body: [
      'Use a unique password for every important account. A password manager makes this practical.',
      'Enable multi-factor authentication (MFA) wherever it’s offered. An OTP or authenticator app blocks most account takeovers even if your password leaks.',
      'Keep your recovery phone number and email up to date — they’re how you prove ownership if something goes wrong.',
    ],
  },
];

const RULES = [
  { icon: Hand, title: 'STOP', text: "Don't act under pressure." },
  { icon: SearchCheck, title: 'VERIFY', text: 'Check through official channels.' },
  { icon: Share2, title: 'NEVER SHARE OTP', text: 'Legitimate support should not ask for your OTP.' },
  { icon: Link2, title: 'CHECK THE LINK', text: 'Inspect suspicious domains before clicking.' },
  { icon: Flag, title: 'REPORT', text: 'Report scams and suspicious communications.' },
];

function TopicCard({ topic }: { topic: (typeof TOPICS)[number] }) {
  const [open, setOpen] = useState(false);
  const Icon = topic.icon;
  return (
    <div className="glass-card overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-white/5">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${topic.color} shadow-glow-cyan`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-semibold text-white">{topic.title}</p>
          <p className="mt-0.5 truncate text-xs text-slate-400">{topic.summary}</p>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="space-y-2.5 border-t border-white/5 p-5 pt-4 animate-fade-in">
          {topic.body.map((para, i) => (
            <p key={i} className="text-sm leading-relaxed text-slate-300">{para}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export function SafetyPage() {
  return (
    <div className="space-y-6">
      <div className="glass-card flex items-center gap-2.5 p-6">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyber-cyan shadow-glow-cyan">
          <ShieldQuestion className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Digital Safety Center</h1>
          <p className="text-sm text-slate-400">Learn to spot fraud before it reaches you.</p>
        </div>
      </div>

      {/* Topic cards */}
      <section className="grid gap-4 md:grid-cols-2">
        {TOPICS.map((t) => (
          <TopicCard key={t.id} topic={t} />
        ))}
      </section>

      {/* Golden rules */}
      <section className="glass-card relative overflow-hidden p-6">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyber-cyan" />
            <h2 className="font-display text-lg font-semibold text-white">The 5 Golden Rules</h2>
            <span className="h-px flex-1 bg-gradient-to-r from-cyber-cyan to-transparent" />
          </div>
          <p className="mb-5 text-xs text-slate-500">Memorize these — they stop most scams.</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {RULES.map((r, i) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="group relative rounded-2xl border border-white/5 bg-ink-700/50 p-4 text-center transition hover:border-cyber-cyan/30 hover:bg-white/5 animate-slide-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-cyber-blue/20 to-cyber-accent/20 ring-1 ring-white/10 transition group-hover:scale-110">
                    <Icon className="h-5 w-5 text-cyber-cyan" />
                  </div>
                  <p className="mt-3 font-display text-sm font-bold tracking-wide text-white">{r.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{r.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
