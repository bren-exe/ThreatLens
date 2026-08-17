import { ToastProvider } from '@/components/Toast';
import { RouterProvider, useRouter } from '@/components/Router';
import { HistoryProvider } from '@/components/HistoryProvider';
import { DemoProvider } from '@/components/DemoProvider';
import { CyberBackground } from '@/components/CyberBackground';
import { Sidebar, Header } from '@/components/Sidebar';
import { DashboardPage } from '@/pages/DashboardPage';
import { ScannerPage } from '@/pages/ScannerPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { SafetyPage } from '@/pages/SafetyPage';
import { AboutPage } from '@/pages/AboutPage';
import { ShieldHalf } from 'lucide-react';

function PageOutlet() {
  const { route } = useRouter();
  switch (route) {
    case 'dashboard':
      return <DashboardPage />;
    case 'scanner':
      return <ScannerPage />;
    case 'history':
      return <HistoryPage />;
    case 'safety':
      return <SafetyPage />;
    case 'about':
      return <AboutPage />;
    default:
      return <DashboardPage />;
  }
}

function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-5">
      <div className="flex flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <ShieldHalf className="h-3.5 w-3.5 text-cyber-cyan/70" />
          <span>CyberShield is an educational security assistant. Always verify suspicious communications through official channels.</span>
        </div>
        <p className="text-[11px] text-slate-600">Never enter real passwords, OTPs, card numbers or sensitive personal information into this demo.</p>
      </div>
    </footer>
  );
}

function MainContent() {
  const { route } = useRouter();
  return (
    <main id="main-scroll" className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
      <div key={route} className="mx-auto max-w-6xl animate-fade-in">
        <PageOutlet />
      </div>
      <Footer />
    </main>
  );
}

function App() {
  return (
    <ToastProvider>
      <RouterProvider>
        <HistoryProvider>
          <DemoProvider>
            <CyberBackground />
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex min-w-0 flex-1 flex-col">
                <Header />
                <MainContent />
              </div>
            </div>
          </DemoProvider>
        </HistoryProvider>
      </RouterProvider>
    </ToastProvider>
  );
}

export default App;
