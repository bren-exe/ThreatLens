import { ShieldCheck } from 'lucide-react';
import { useRouter, type Route } from '@/components/Router';

const LINKS: { label: string; route: Route }[] = [
  { label: 'Scanner', route: 'scanner' },
  { label: 'Tools', route: 'tools' },
  { label: 'History', route: 'history' },
  { label: 'Safety', route: 'safety' },
  { label: 'Learn', route: 'learn' },
  { label: 'About', route: 'about' },
];

export function Footer() {
  const { navigate } = useRouter();
  return (
    <footer className="border-t border-ink-600 bg-ink-950">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-base font-bold text-white">ThreatLens</span>
            </div>
            <p className="mt-3 text-sm font-medium text-slate-300">See the threat. Understand the risk. Stay safe.</p>
            <p className="mt-2 text-xs text-slate-500">Analyze suspicious links, messages, emails and other digital threats before you interact with them.</p>
          </div>

          <div className="flex gap-12">
            <div>
              <p className="label mb-3">Navigate</p>
              <div className="flex flex-col gap-2">
                {LINKS.map((l) => (
                  <button key={l.label} onClick={() => navigate(l.route)} className="text-left text-sm text-slate-400 transition hover:text-white">
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="label mb-3">Project</p>
              <div className="flex flex-col gap-2 text-sm text-slate-400">
                <span>Hackathon Project</span>
                <span>Cybersecurity + AI</span>
                <span>Digital Safety</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-ink-600 pt-6 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>ThreatLens is an educational security assistant. Always verify suspicious communications through official channels.</p>
          <p>Never enter real passwords, OTPs, card numbers or sensitive personal information into this tool.</p>
        </div>
      </div>
    </footer>
  );
}
