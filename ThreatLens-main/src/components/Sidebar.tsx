import { ShieldCheck, LayoutDashboard, ScanLine, History, ShieldQuestion, Info, Menu, X, ShieldHalf, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter, type Route } from '@/components/Router';
import { useDemo } from '@/components/DemoProvider';
import { DEMO_EXAMPLES } from '@/lib/analyzeThreat';
import { useToast } from '@/components/Toast';

const NAV: { id: Route; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scanner', label: 'Threat Scanner', icon: ScanLine },
  { id: 'history', label: 'Threat History', icon: History },
  { id: 'safety', label: 'Safety Center', icon: ShieldQuestion },
  { id: 'about', label: 'About CyberShield', icon: Info },
];

export function Sidebar() {
  const { route, navigate } = useRouter();
  const { launchDemo } = useDemo();
  const { push } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  const launchLiveDemo = () => {
    launchDemo(DEMO_EXAMPLES.phishing.text, DEMO_EXAMPLES.phishing.type);
    navigate('scanner');
    setMobileOpen(false);
    push('info', 'Live Demo Mode', 'Auto-running a phishing scan for the judges.');
  };

  const navContent = (
    <>
      <div className="flex items-center gap-2.5 px-3 py-5">
        <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyber-blue to-cyber-accent shadow-glow">
          <ShieldHalf className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-display text-base font-bold tracking-tight text-white">CyberShield</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-cyber-cyan/80">AI Digital Safety</p>
        </div>
      </div>

      <nav className="mt-2 flex flex-col gap-1 px-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = route === item.id;
          return (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`nav-link ${active ? 'nav-link-active' : ''}`}
            >
              <Icon className={`h-[18px] w-[18px] ${active ? 'text-cyber-cyan' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-3 pb-4 pt-6">
        <button onClick={launchLiveDemo} className="btn-accent w-full">
          <ScanLine className="h-4 w-4" />
          Launch Demo
        </button>
        <p className="mt-3 px-1 text-[10px] leading-relaxed text-slate-600">
          Educational security assistant. Verify suspicious communications through official channels.
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-ink-900/70 backdrop-blur-xl lg:flex">
        {navContent}
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/5 bg-ink-950/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-cyber-blue to-cyber-accent">
            <ShieldHalf className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold text-white">CyberShield</p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-cyber-cyan/80">AI Digital Safety</p>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-white/10 bg-ink-900 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between px-3 pt-3">
              <span className="px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}

export function Header() {
  const { navigate } = useRouter();
  const { launchDemo } = useDemo();
  const { push } = useToast();
  const [now] = useState(() => new Date());

  const launchLiveDemo = () => {
    launchDemo(DEMO_EXAMPLES.phishing.text, DEMO_EXAMPLES.phishing.type);
    navigate('scanner');
    push('info', 'Live Demo Mode', 'Auto-running a phishing scan for the judges.');
  };

  return (
    <header className="sticky top-0 z-30 hidden items-center justify-between border-b border-white/5 bg-ink-950/70 px-6 py-3.5 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-5 w-5 text-cyber-cyan" />
        <span className="text-sm font-medium text-slate-300">AI Digital Safety</span>
        <span className="ml-2 hidden text-xs text-slate-600 xl:inline">
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={launchLiveDemo} className="btn-outline group">
          <ScanLine className="h-4 w-4 transition-transform group-hover:rotate-12" />
          <span className="hidden sm:inline">Launch Demo</span>
        </button>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Protected</span>
        </div>
        <button
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-cyber-cyan/40 hover:text-white"
          aria-label="Account"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
