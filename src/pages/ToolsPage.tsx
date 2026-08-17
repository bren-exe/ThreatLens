import { ScanLine, Globe, Image, QrCode, Phone, FileSearch, History, Chrome, ArrowRight } from 'lucide-react';
import { useRouter } from '@/components/Router';
import { BatchScanner } from '@/components/BatchScanner';

const TOOLS = [
  { icon: ScanLine, name: 'Threat Scanner', desc: 'Analyze suspicious messages, emails, and text for phishing and fraud indicators.', action: 'scanner' as const },
  { icon: Globe, name: 'URL Scanner', desc: 'Check if a link is safe before you click. Inspects domains, TLDs, and URL patterns.', action: 'scanner' as const },
  { icon: Image, name: 'Screenshot Scanner', desc: 'Upload a screenshot of a suspicious message or page for analysis.', action: 'scanner' as const },
  { icon: QrCode, name: 'QR Scanner', desc: 'Upload a QR code image to decode and analyze its embedded content.', action: 'scanner' as const },
  { icon: Phone, name: 'Phone Checker', desc: 'Check a phone number for suspicious patterns before you respond.', action: 'scanner' as const },
  { icon: FileSearch, name: 'Batch URL Scanner', desc: 'Scan multiple URLs at once and get a summary table of results.', action: 'batch' as const },
  { icon: History, name: 'Threat History', desc: 'Review your past scans, filter by risk level, and search records.', action: 'history' as const },
  { icon: Chrome, name: 'Browser Extension', desc: 'Real-time browsing protection. Coming soon.', action: 'about' as const },
];

export function ToolsPage() {
  const { navigate } = useRouter();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-white">ThreatLens Security Tools</h1>
        <p className="mt-1 text-sm text-slate-400">A toolkit for analyzing suspicious content across formats.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.name} className="surface rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/10 border border-brand/30">
                  <Icon className="h-5 w-5 text-brand" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{t.desc}</p>
                  <button
                    onClick={() => navigate(t.action === 'batch' ? 'tools' : t.action)}
                    className="mt-3 flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-light"
                  >
                    Open tool <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <BatchScanner />
      </div>
    </div>
  );
}
