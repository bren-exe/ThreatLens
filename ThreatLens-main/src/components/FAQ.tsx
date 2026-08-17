import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface QA {
  q: string;
  a: string;
}

const QUESTIONS: QA[] = [
  {
    q: 'How does ThreatLens detect phishing?',
    a: 'ThreatLens analyzes content using a rule-based detection engine that evaluates known phishing patterns — urgency language, credential requests, suspicious URLs, impersonation cues, and financial red flags. Each signal contributes to a weighted risk score. ThreatLens does not claim 100% detection accuracy.',
  },
  {
    q: 'What can I scan?',
    a: 'You can scan URLs, text messages, emails, screenshots, QR codes, and phone numbers. Each input type is analyzed for the threat signals relevant to that format.',
  },
  {
    q: 'Can ThreatLens detect UPI scams?',
    a: 'Yes. ThreatLens recognizes common UPI scam patterns including payment requests, fake prize fees, and requests for UPI PINs or OTPs. However, no tool can catch every scam — always verify through official channels.',
  },
  {
    q: 'Can I analyze screenshots?',
    a: 'Yes. Upload a screenshot of a suspicious message, email, or webpage. ThreatLens extracts available text and analyzes it for phishing indicators, suspicious URLs, and threat signals.',
  },
  {
    q: 'Can I scan QR codes?',
    a: 'Yes. Upload a QR code image and ThreatLens decodes its content, then analyzes any embedded URL or text for malicious patterns. ThreatLens never automatically opens the decoded destination.',
  },
  {
    q: 'How does AI help?',
    a: 'ThreatLens uses an AI-assisted analysis engine to produce human-readable explanations of detected threats. Instead of just showing a score, it explains why content was flagged and what action you should take.',
  },
  {
    q: 'Can ThreatLens guarantee that a link is safe?',
    a: 'No. No security tool can guarantee with 100% certainty that a link is safe. ThreatLens provides a risk assessment based on available signals, but you should always exercise caution and verify through official channels.',
  },
  {
    q: 'What should I do after finding a phishing message?',
    a: 'Do not click any links, do not share personal information, report the message to the relevant platform or organization, and block the sender. If you already shared information, contact your bank or the affected service immediately.',
  },
  {
    q: 'What information should I never enter?',
    a: 'Never enter real passwords, OTPs, card numbers, CVVs, UPI PINs, Aadhaar numbers, or any sensitive personal information into ThreatLens. It is an educational tool — only paste the suspicious content you want analyzed.',
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2.5">
      {QUESTIONS.map((qa, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="surface rounded-lg overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left"
            >
              <span className="text-sm font-medium text-slate-200">{qa.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-sm leading-relaxed text-slate-400 animate-fade-in">
                {qa.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
