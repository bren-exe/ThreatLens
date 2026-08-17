import { useState } from 'react';
import { ShieldCheck, Menu, X, ScanLine } from 'lucide-react';
import { useRouter, type Route } from '@/components/Router';

const NAV_ITEMS: { id: Route; label: string }[] = [
  { id: 'scanner', label: 'Scanner' },
  { id: 'tools', label: 'Tools' },
  { id: 'history', label: 'History' },
  { id: 'safety', label: 'Safety' },
  { id: 'learn', label: 'Learn' },
  { id: 'about', label: 'About' },
];

export function TopNav() {
  const { route, navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink-600 bg-ink-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button onClick={() => go('home')} className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-base font-bold tracking-tight text-white">ThreatLens</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                route === item.id ? 'text-white bg-ink-800' : 'text-slate-400 hover:text-white hover:bg-ink-800/50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-2">
          <button onClick={() => go('scanner')} className="btn-primary hidden sm:inline-flex">
            <ScanLine className="h-4 w-4" /> Scan Now
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-300 hover:bg-ink-800 hover:text-white md:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-ink-600 bg-ink-950 px-4 py-3 md:hidden animate-slide-down">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`rounded-md px-3 py-2 text-sm font-medium text-left transition ${
                  route === item.id ? 'text-white bg-ink-800' : 'text-slate-400 hover:text-white hover:bg-ink-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button onClick={() => go('scanner')} className="btn-primary mt-2">
              <ScanLine className="h-4 w-4" /> Scan Now
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
