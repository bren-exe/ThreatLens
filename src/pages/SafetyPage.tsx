import { useState } from 'react';
import {
  ShieldQuestion,
  Mail,
  Wallet,
  KeyRound,
  QrCode,
  Truck,
  Headphones,
  Briefcase,
  TrendingUp,
  Drama,
  ChevronDown,
  Hand,
  SearchCheck,
  Share2,
  Link2,
  Flag,
} from 'lucide-react';

interface Topic {
  id: string;
  icon: typeof Mail;
  title: string;
  summary: string;
  looksLike: string[];
  warningSigns: string[];
  doThis: string[];
  dontDo: string[];
}

const TOPICS: Topic[] = [
  {
    id: 'phishing',
    icon: Mail,
    title: 'Phishing',
    summary: 'Fake messages and emails that trick you into clicking links or sharing details.',
    looksLike: [
      'Messages pretending to be from your bank, a delivery service, or a government office.',
      'A generic greeting like "Dear Customer" instead of your name.',
      'A link that looks almost right but leads to a fake site.',
    ],
    warningSigns: [
      'Urgent language pressuring you to act immediately.',
      'Requests for account, password, or payment information.',
      'Slightly misspelled domains (paypa1.com, amaz0n.in).',
    ],
    doThis: [
      'Open the official app or type the website address yourself.',
      'Report the message to the organization it impersonates.',
      'Delete the message and block the sender.',
    ],
    dontDo: [
      'Do not click links in suspicious messages.',
      'Do not enter your password or card details on a linked page.',
      'Do not reply with personal information.',
    ],
  },
  {
    id: 'upi',
    icon: Wallet,
    title: 'UPI Scams',
    summary: 'Fraud involving UPI payment requests, fake collect requests, and payment forwards.',
    looksLike: [
      'A stranger sends a "collect" request asking you to approve a payment.',
      'Messages claiming you won a prize and must pay a small fee via UPI to claim it.',
      'A seller asks you to scan a QR code to "receive" money — but it actually sends money.',
    ],
    warningSigns: [
      'You are asked to enter your UPI PIN to "receive" money.',
      'Unsolicited payment requests from unknown numbers.',
      'Pressure to pay immediately to claim a reward.',
    ],
    doThis: [
      'Remember: receiving money never requires entering your UPI PIN.',
      'Decline and report unknown collect requests.',
      'Verify any payment request through the official app.',
    ],
    dontDo: [
      'Never enter your UPI PIN to receive money.',
      'Do not scan QR codes from untrusted sources.',
      'Do not pay "fees" to claim prizes or rewards.',
    ],
  },
  {
    id: 'kyc',
    icon: KeyRound,
    title: 'KYC Scams',
    summary: 'Threats that your account will be closed unless you "complete KYC" via a link.',
    looksLike: [
      'Messages claiming your KYC is pending or expired.',
      'Threats that your account will be suspended today.',
      'Requests to submit Aadhaar, PAN, or other ID details through a link.',
    ],
    warningSigns: [
      'Urgent deadlines — "within 24 hours" or "today".',
      'Links to unofficial websites for "KYC update".',
      'Requests for sensitive ID documents over message.',
    ],
    doThis: [
      'Check your KYC status in the official app or website.',
      'Contact customer support through verified channels.',
      'Report the message as fraud.',
    ],
    dontDo: [
      'Do not click the KYC link in the message.',
      'Do not upload ID documents through suspicious links.',
      'Do not share Aadhaar or PAN numbers over messages.',
    ],
  },
  {
    id: 'otp',
    icon: KeyRound,
    title: 'OTP Scams',
    summary: 'Attempts to steal your one-time password — the last line of defense for your account.',
    looksLike: [
      'A caller claiming to be from your bank asks you to read out an OTP.',
      'Messages saying "share this code to confirm your identity".',
      'Someone posing as a police officer or government official requesting an OTP.',
    ],
    warningSigns: [
      'Anyone — anyone at all — asking for your OTP.',
      'Calls creating panic about your account or a family member.',
      'Requests to share a "verification code" or "security code".',
    ],
    doThis: [
      'Hang up immediately and block the number.',
      'Treat every OTP like your ATM PIN.',
      'Report the number to your bank and to the cybercrime helpline.',
    ],
    dontDo: [
      'Never share your OTP with anyone — not even customer support.',
      'Never share even part of an OTP.',
      'Do not forward OTPs to anyone claiming to need them.',
    ],
  },
  {
    id: 'qr',
    icon: QrCode,
    title: 'QR Scams',
    summary: 'Malicious QR codes that send you to phishing pages or trigger unwanted payments.',
    looksLike: [
      'A QR code at an informal shop, parking lot, or printed flyer.',
      'A QR code received over message or email that you are urged to scan.',
      'A QR code that opens a payment screen instead of a website.',
    ],
    warningSigns: [
      'You are asked to scan a code to "receive" money or a refund.',
      'The QR code opens a payment app instead of a known website.',
      'Pressure to scan quickly without explanation.',
    ],
    doThis: [
      'Inspect where a QR code leads before entering any information.',
      'Use QR codes only from trusted, verified sources.',
      'Report suspicious QR codes to the platform or merchant.',
    ],
    dontDo: [
      'Do not scan QR codes from unknown or untrusted sources.',
      'Do not enter your UPI PIN after scanning an unfamiliar code.',
      'Do not scan codes received in suspicious messages.',
    ],
  },
  {
    id: 'delivery',
    icon: Truck,
    title: 'Fake Delivery Messages',
    summary: 'Messages about a package on hold, asking you to click a link or pay a small fee.',
    looksLike: [
      'A message saying your package is on hold or could not be delivered.',
      'A link to "confirm your address" or "track your parcel".',
      'A request to pay a small customs or delivery charge.',
    ],
    warningSigns: [
      'You did not order anything, or the tracking number looks odd.',
      'Links to unfamiliar domains (.xyz, .click, .top).',
      'Requests for payment to release a package.',
    ],
    doThis: [
      'Check your orders in the official shopping app.',
      'Track packages only through the courier\'s official website.',
      'Ignore and report messages about packages you did not order.',
    ],
    dontDo: [
      'Do not click tracking links from unknown senders.',
      'Do not pay "customs fees" or "delivery charges" via links in messages.',
      'Do not enter your address or card details on linked pages.',
    ],
  },
  {
    id: 'support',
    icon: Headphones,
    title: 'Fake Customer Support',
    summary: 'Fake support numbers and agents that trick you into sharing access or details.',
    looksLike: [
      'A phone number found on a search engine that claims to be official support.',
      'Someone calling or messaging claiming to be from a company\'s support team.',
      'A "support agent" asking you to install a screen-sharing or remote access app.',
    ],
    warningSigns: [
      'The agent asks for your OTP, password, or remote access.',
      'The number is not listed on the company\'s official website.',
      'Pressure to act quickly to "secure" your account.',
    ],
    doThis: [
      'Find support contacts only on the official website or app.',
      'Hang up and verify through the official helpline.',
      'Report fake support numbers to the platform.',
    ],
    dontDo: [
      'Do not install remote access apps at a stranger\'s request.',
      'Do not share OTPs, passwords, or screen views with "support".',
      'Do not trust support numbers found only through search engines.',
    ],
  },
  {
    id: 'job',
    icon: Briefcase,
    title: 'Job Scams',
    summary: 'Fake job offers that require upfront fees or ask you to "process payments".',
    looksLike: [
      'A job offer for high pay with very little work or experience required.',
      'A request to pay a "registration fee" or "training deposit".',
      'A task that involves receiving money into your account and forwarding it.',
    ],
    warningSigns: [
      'Upfront payment required to get the job.',
      'Communication only over chat apps, never a formal interview.',
      'Requests to use your personal bank account to move money.',
    ],
    doThis: [
      'Research the company and check for reviews and a real website.',
      'Verify job postings through official career portals.',
      'Report suspicious offers to the cybercrime helpline.',
    ],
    dontDo: [
      'Do not pay any fee to get a job.',
      'Do not let anyone use your bank account to transfer money.',
      'Do not share your bank details or ID documents with unverified recruiters.',
    ],
  },
  {
    id: 'investment',
    icon: TrendingUp,
    title: 'Investment Scams',
    summary: 'Promises of guaranteed high returns that target your savings.',
    looksLike: [
      'Messages promising "guaranteed returns" or "double your money in 7 days".',
      'An unknown person on WhatsApp or Telegram offering investment tips.',
      'A link to a trading or investment platform you have never heard of.',
    ],
    warningSigns: [
      'Returns that are far higher than any legitimate investment.',
      'Pressure to invest "today" before a "limited" opportunity closes.',
      'No proper registration or regulatory information.',
    ],
    doThis: [
      'Verify any investment with SEBI or the relevant regulator.',
      'Use only well-known, registered investment platforms.',
      'Talk to a licensed financial advisor before investing.',
    ],
    dontDo: [
      'Do not send money to unknown UPI IDs or accounts for "investment".',
      'Do not trust tips from strangers on chat apps.',
      'Do not invest based on urgency or fear of missing out.',
    ],
  },
  {
    id: 'social-engineering',
    icon: Drama,
    title: 'Social Engineering',
    summary: 'Manipulation that exploits fear, greed, or the desire to help — instead of technology.',
    looksLike: [
      'A message saying a family member is in trouble and needs money urgently.',
      'A caller pretending to be a government official threatening legal action.',
      'Someone asking you to "verify your identity" by sharing details.',
    ],
    warningSigns: [
      'Emotional pressure — fear, urgency, curiosity, or a too-good offer.',
      'Requests that bypass normal procedures or channels.',
      'A stranger asking you to keep the conversation secret.',
    ],
    doThis: [
      'Slow down and verify through an independent, official channel.',
      'Contact the family member or organization directly.',
      'Report suspicious contacts to the cybercrime helpline (1930 in India).',
    ],
    dontDo: [
      'Do not act under pressure — scammers rely on panic.',
      'Do not share personal or financial details to "verify" yourself.',
      'Do not keep suspicious contacts secret — tell someone you trust.',
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

function TopicCard({ topic }: { topic: Topic }) {
  const [open, setOpen] = useState(false);
  const Icon = topic.icon;
  return (
    <div className="surface overflow-hidden rounded-xl">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-ink-800/50">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 border border-brand/30">
          <Icon className="h-5 w-5 text-brand" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-semibold text-white">{topic.title}</p>
          <p className="mt-0.5 truncate text-xs text-slate-400">{topic.summary}</p>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="space-y-4 border-t border-ink-600 p-5 pt-4 animate-fade-in">
          <div>
            <p className="label mb-2">What it looks like</p>
            <ul className="space-y-1.5">
              {topic.looksLike.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-2">Warning signs</p>
            <ul className="space-y-1.5">
              {topic.warningSigns.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-warning" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="label mb-2 text-safe">What to do</p>
              <ul className="space-y-1.5">
                {topic.doThis.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-safe" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label mb-2 text-critical">What NOT to do</p>
              <ul className="space-y-1.5">
                {topic.dontDo.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-critical" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SafetyPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand">
          <ShieldQuestion className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Digital Safety Center</h1>
          <p className="text-sm text-slate-400">Learn to spot fraud before it reaches you.</p>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        {TOPICS.map((t) => (
          <TopicCard key={t.id} topic={t} />
        ))}
      </section>

      <section className="surface mt-8 rounded-xl p-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-px w-8 bg-brand/40" />
          <h2 className="font-display text-lg font-semibold text-white">The 5 Golden Rules</h2>
          <span className="h-px flex-1 bg-ink-600" />
        </div>
        <p className="mb-5 text-xs text-slate-500">Memorize these — they stop most scams.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {RULES.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className="surface-2 rounded-xl p-4 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand/10 border border-brand/30">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <p className="mt-3 font-display text-sm font-bold tracking-wide text-white">{r.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{r.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
