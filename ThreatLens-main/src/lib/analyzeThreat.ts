import type {
  Indicator,
  Recommendation,
  RiskBreakdown,
  RiskLevel,
  ScanType,
  ThreatAnalysis,
} from './types';

interface RuleHit {
  indicator: Indicator;
  categories: string[];
  recs: Recommendation[];
}

interface Rule {
  id: string;
  label: string;
  severity: Indicator['severity'];
  detail: string;
  weight: number;
  categories: string[];
  recs: Recommendation[];
  test: (text: string, lower: string, type: ScanType) => boolean;
}

const URL_SHORTENER = /\/\/(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|rebrand\.ly|cutt\.ly|shorte\.st|rb\.gy)\b/i;
const HTTP_URL = /\bhttp:\/\//i;
const ANY_URL = /\bhttps?:\/\/[^\s]+/i;
const SUSPICIOUS_TLD = /\.(?:zip|mov|xyz|top|click|country|work|gq|tk|ml|cf|rest|cyou|quest|beauty|review)\b/i;
const MANY_SUBDOMAINS = /(?:[a-z0-9-]+\.){3,}[a-z]{2,}/i;
const BRAND_KEYWORDS =
  /(secure|verify|login|account|update|confirm|validation|support|official|bank|wallet|unlock|reactivate|suspended|limited)/i;

const RULES: Rule[] = [
  {
    id: 'otp-request',
    label: 'OTP Request',
    severity: 'CRITICAL',
    detail: 'Asks for a one-time password (OTP). Legitimate support never asks for OTPs.',
    weight: 30,
    categories: ['credential', 'social-engineering'],
    recs: [
      { id: 'never-otp', text: 'Never share your OTP with anyone — not even customer support.' },
      { id: 'report-otp', text: 'Report the sender immediately; no genuine organization requests OTPs.' },
    ],
    test: (_t, l) => /\b(otp|one[\s-]?time[\s-]?password|verification code|security code|cvv|cvv code)\b/.test(l),
  },
  {
    id: 'password-request',
    label: 'Credential Request',
    severity: 'CRITICAL',
    detail: 'Requests a password or login credentials.',
    weight: 32,
    categories: ['credential'],
    recs: [
      { id: 'no-password', text: 'Never share passwords. Organizations never ask for them.' },
      { id: 'change-pwd', text: 'If you entered a password anywhere, change it immediately on the official site.' },
    ],
    test: (_t, l) => /\b(password|passwd|pin\b|login credentials|sign[\s-]?in code|passcode)\b/.test(l),
  },
  {
    id: 'bank-card-request',
    label: 'Financial Information Request',
    severity: 'HIGH',
    detail: 'Asks for bank account, card, or payment details.',
    weight: 26,
    categories: ['financial'],
    recs: [
      { id: 'no-bank', text: 'Do not share bank account numbers, card numbers, CVV, or UPI PIN.' },
      { id: 'verify-bank', text: 'Contact your bank directly through their official app or helpline.' },
    ],
    test: (_t, l) =>
      /\b(card number|cvv|debit card|credit card|bank account number|upi id|upi pin|account details|expiry date|card details)\b/.test(l),
  },
  {
    id: 'financial-payment',
    label: 'Financial Request',
    severity: 'HIGH',
    detail: 'Requests a payment, fee, or transfer of money.',
    weight: 22,
    categories: ['financial'],
    recs: [
      { id: 'no-pay', text: 'Do not make any payment to claim a prize, offer, or unlock an account.' },
      { id: 'verify-pay', text: 'Verify the request through the organization’s official website or app.' },
    ],
    test: (_t, l) =>
      /\b(processing fee|registration fee|payment|pay (?:now|immediately|rs|₹)|transfer (?:funds|money)|deposit|wire|send (?:money|₹|rs)|clearance fee|customs fee|fee of)\b/i.test(l),
  },
  {
    id: 'prize-scam',
    label: 'Prize / Reward Scam',
    severity: 'HIGH',
    detail: 'Claims you have won a prize, lottery, or reward you did not enter.',
    weight: 30,
    categories: ['financial', 'social-engineering'],
    recs: [
      { id: 'no-prize', text: 'You cannot win a lottery or contest you never entered — it is a scam.' },
      { id: 'block-prize', text: 'Block and report the sender; do not pay any “fee” to claim a prize.' },
    ],
    test: (_t, l) =>
      /\b(you(?:'ve| have) won|congratulations|winner|lottery|lucky draw|prize|reward|jackpot|selected for|you are chosen|gift card|free gift)\b/i.test(l),
  },
  {
    id: 'urgency',
    label: 'Urgency / Pressure',
    severity: 'HIGH',
    detail: 'Creates artificial urgency to force a quick decision.',
    weight: 18,
    categories: ['social-engineering'],
    recs: [
      { id: 'slow-down', text: 'Stop and think — scammers rely on panic. Take your time before acting.' },
      { id: 'verify-urgent', text: 'Verify urgent claims through official channels before doing anything.' },
    ],
    test: (_t, l) =>
      /\b(urgent|immediately|right now|today|within (?:an? )?(?:hour|day)|act now|asap|now or|expires? (?:today|soon|in)|last (?:chance|warning)|final notice|don't? (?:ignore|wait)|delay (?:will|may)|will be (?:suspend|block|terminat|delet))\b/i.test(l),
  },
  {
    id: 'account-suspension',
    label: 'Account Suspension Threat',
    severity: 'HIGH',
    detail: 'Threatens account suspension, blocking, or loss of access.',
    weight: 20,
    categories: ['social-engineering'],
    recs: [
      { id: 'verify-suspend', text: 'Log in to the official app or website to check your real account status.' },
      { id: 'no-suspend-link', text: 'Do not use the link in the message to “restore” your account.' },
    ],
    test: (_t, l) =>
      /\b(suspend|deactivat|terminat|block(?:ed)?|disable|lock(?:ed)?|close your account|restrict|freeze|limited access|lose access|account will be)\b/i.test(l),
  },
  {
    id: 'impersonation',
    label: 'Impersonation',
    severity: 'HIGH',
    detail: 'Impersonates a trusted organization (bank, government, support).',
    weight: 20,
    categories: ['social-engineering'],
    recs: [
      { id: 'verify-impersonation', text: 'Verify the sender through the organization’s official website or app.' },
      { id: 'report-impersonation', text: 'Report impersonation to the real organization and block the sender.' },
    ],
    test: (_t, l) =>
      /\b(bank|your account|our records|customer (?:support|care|service)|official|government|tax (?:department|office)|income tax|gst|kyc|irctc|amazon|flipkart|google|microsoft|apple|paypal|netflix|instagram|facebook|whatsapp)\b/i.test(l),
  },
  {
    id: 'suspicious-url',
    label: 'Suspicious Link',
    severity: 'HIGH',
    detail: 'Contains a link that may lead to a fake or malicious website.',
    weight: 25,
    categories: ['url'],
    recs: [
      { id: 'no-click', text: 'Do not click the link. Hover or inspect the full URL first.' },
      { id: 'type-url', text: 'If needed, type the official website address directly into your browser.' },
    ],
    test: (t, l) => {
      if (!ANY_URL.test(t)) return false;
      // any URL in a message adds some risk; refined by other URL rules
      return true;
    },
  },
  {
    id: 'http-url',
    label: 'Insecure HTTP Link',
    severity: 'MEDIUM',
    detail: 'Uses an unencrypted http:// connection instead of https://.',
    weight: 15,
    categories: ['url'],
    recs: [
      { id: 'no-http', text: 'Avoid http:// links — they are not encrypted. Legitimate sites use https://.' },
    ],
    test: (t) => HTTP_URL.test(t),
  },
  {
    id: 'url-shortener',
    label: 'URL Shortener',
    severity: 'MEDIUM',
    detail: 'Uses a link shortener that hides the real destination.',
    weight: 18,
    categories: ['url'],
    recs: [
      { id: 'expand-short', text: 'Expand shortened links with a preview tool before clicking.' },
    ],
    test: (t) => URL_SHORTENER.test(t),
  },
  {
    id: 'suspicious-domain',
    label: 'Suspicious Domain',
    severity: 'HIGH',
    detail: 'Domain uses an unusual TLD or a misleading subdomain pattern.',
    weight: 22,
    categories: ['url'],
    recs: [
      { id: 'check-domain', text: 'Check the domain carefully — scammers use look-alike names and odd endings.' },
    ],
    test: (t) => {
      const urls = t.match(/https?:\/\/[^\s]+/gi) || [];
      return urls.some((u) => SUSPICIOUS_TLD.test(u) || (MANY_SUBDOMAINS.test(u) && BRAND_KEYWORDS.test(u)));
    },
  },
  {
    id: 'unrealistic-offer',
    label: 'Unrealistic Offer',
    severity: 'MEDIUM',
    detail: 'Promises unusually large rewards, discounts, or returns.',
    weight: 16,
    categories: ['financial', 'social-engineering'],
    recs: [
      { id: 'too-good', text: 'If an offer seems too good to be true, it almost certainly is.' },
    ],
    test: (_t, l) =>
      /\b(₹\s?\d[\d,]{4,}|\d[\d,]{5,}\s?(?:rs|rupees|₹)|guaranteed return|double your|100% free|free (?:iphone|laptop|iphone 1[0-9]|cash)|investment (?:of|return)|earn (?:₹|\d[\d,]{4,})|work from home.*earn)\b/i.test(l),
  },
  {
    id: 'personal-info-request',
    label: 'Personal Information Request',
    severity: 'MEDIUM',
    detail: 'Asks for personal details such as Aadhaar, PAN, or address.',
    weight: 18,
    categories: ['credential', 'social-engineering'],
    recs: [
      { id: 'no-personal', text: 'Do not share Aadhaar, PAN, or other personal details over messages.' },
    ],
    test: (_t, l) =>
      /\b(aadhaar|pan card|passport|address proof|kyc details|personal details|send your details|share your details|full name.*address)\b/i.test(l),
  },
  {
    id: 'grammar-oddity',
    label: 'Suspicious Language',
    severity: 'LOW',
    detail: 'Contains unusual phrasing, excessive capitalization, or poor grammar.',
    weight: 8,
    categories: ['social-engineering'],
    recs: [
      { id: 'watch-language', text: 'Be cautious of odd phrasing and excessive capitalization — common in scams.' },
    ],
    test: (t) => {
      const caps = (t.match(/[A-Z]{4,}/g) || []).length;
      const words = t.trim().split(/\s+/).length || 1;
      return caps / words > 0.12 || /\b(?:kindly|dear (?:customer|user)|do the needful|revert back|please kindly)\b/i.test(t);
    },
  },
  {
    id: 'support-impersonation',
    label: 'Support / Verification Impersonation',
    severity: 'HIGH',
    detail: 'Claims to be support and asks you to verify or confirm identity.',
    weight: 18,
    categories: ['social-engineering', 'credential'],
    recs: [
      { id: 'no-support-verify', text: 'Real support will never ask you to “verify” by sending codes or details.' },
      { id: 'contact-official', text: 'Reach support only through the official app or verified helpline.' },
    ],
    test: (_t, l) =>
      /\b(support (?:representative|agent|team)|verification (?:process|required)|verify your (?:identity|account)|selected for verification|prevent (?:suspension|deactivation))\b/i.test(l),
  },
];

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}

function levelFromScore(score: number): RiskLevel {
  if (score <= 20) return 'SAFE';
  if (score <= 40) return 'LOW';
  if (score <= 70) return 'MEDIUM';
  if (score <= 90) return 'HIGH';
  return 'CRITICAL';
}

function buildExplanation(level: RiskLevel, hits: RuleHit[]): string {
  if (hits.length === 0) {
    return 'No significant threat indicators were detected. The content appears routine and does not show common patterns of phishing, fraud, or social engineering. Stay alert, but no action is needed.';
  }
  const labels = hits.slice(0, 4).map((h) => h.indicator.label.toLowerCase());
  const lead =
    level === 'CRITICAL'
      ? 'This content shows multiple high-confidence indicators of a serious phishing or fraud attempt.'
      : level === 'HIGH'
        ? 'This message contains several indicators commonly associated with phishing and online scams.'
        : level === 'MEDIUM'
          ? 'This content shows some suspicious patterns that warrant caution before you act.'
          : 'A few minor indicators were detected, but the content is largely low risk.';

  const detail = `${labels.join(', ')}. ${hits
    .slice(0, 3)
    .map((h) => h.indicator.detail)
    .join(' ')}`.replace(/\s{2,}/g, ' ');

  return `${lead} Detected signals include ${detail}`;
}

function buildBreakdown(hits: RuleHit[]): RiskBreakdown {
  const sum = (cat: string) => {
    const matched = hits.filter((h) => h.categories.includes(cat));
    if (matched.length === 0) return 0;
    const raw = matched.reduce((acc, h) => acc + h.indicator.weight, 0);
    // scale: a single medium hit ~ 55, multiple high hits approach 100
    return clamp(Math.round(raw * 1.15 + 8));
  };
  return {
    socialEngineering: sum('social-engineering'),
    urlRisk: sum('url'),
    credentialRisk: sum('credential'),
    financialRisk: sum('financial'),
  };
}

function dedupeRecs(recs: Recommendation[]): Recommendation[] {
  const seen = new Set<string>();
  const out: Recommendation[] = [];
  for (const r of recs) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    out.push(r);
  }
  return out;
}

export function analyzeThreat(input: string, type: ScanType = 'MESSAGE'): ThreatAnalysis {
  const text = input.trim();
  const lower = text.toLowerCase();

  if (!text) {
    return {
      score: 0,
      level: 'SAFE',
      indicators: [],
      breakdown: { socialEngineering: 0, urlRisk: 0, credentialRisk: 0, financialRisk: 0 },
      explanation: 'No content was provided to analyze.',
      recommendations: [],
      detectedCategories: [],
    };
  }

  const hits: RuleHit[] = [];
  for (const rule of RULES) {
    if (rule.test(text, lower, type)) {
      hits.push({
        indicator: {
          id: rule.id,
          label: rule.label,
          severity: rule.severity,
          detail: rule.detail,
          weight: rule.weight,
        },
        categories: rule.categories,
        recs: rule.recs,
      });
    }
  }

  // Weighted score: sum weights, dampen slightly so many low signals don't max out falsely
  const raw = hits.reduce((acc, h) => acc + h.indicator.weight, 0);
  // diminishing returns after 80
  let score = raw;
  if (raw > 80) score = 80 + (raw - 80) * 0.55;
  score = clamp(Math.round(score));

  const level = levelFromScore(score);
  const categories = Array.from(new Set(hits.flatMap((h) => h.categories)));
  const recommendations = dedupeRecs(hits.flatMap((h) => h.recs));

  // Always include a baseline safe-action when there is any risk
  if (recommendations.length === 0 && level !== 'SAFE') {
    recommendations.push({ id: 'verify', text: 'Verify through official channels before taking any action.' });
  }

  return {
    score,
    level,
    indicators: hits.map((h) => h.indicator),
    breakdown: buildBreakdown(hits),
    explanation: buildExplanation(level, hits),
    recommendations,
    detectedCategories: categories,
  };
}

export const DEMO_EXAMPLES: Record<string, { type: ScanType; text: string; label: string }> = {
  phishing: {
    type: 'MESSAGE',
    label: 'Phishing Example',
    text: 'URGENT: Your bank account will be suspended today. Verify your account immediately to avoid losing access. Click here: http://secure-bank-verification.example.com/login',
  },
  scam: {
    type: 'MESSAGE',
    label: 'Scam Example',
    text: 'Congratulations! You have won ₹50,00,000 in our lucky draw. Pay ₹2,999 processing fee immediately to claim your prize. Send your details to receive the reward.',
  },
  safe: {
    type: 'MESSAGE',
    label: 'Safe Example',
    text: 'Your electricity bill of ₹1,240 is due on 20 August. Please make your payment through the official electricity provider application.',
  },
  otp: {
    type: 'MESSAGE',
    label: 'Suspicious OTP Example',
    text: 'Your account has been selected for verification. Please send the OTP received on your phone to our support representative to prevent account suspension.',
  },
};
