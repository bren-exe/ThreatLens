import { ToastProvider } from '@/components/Toast';
import { RouterProvider, useRouter } from '@/components/Router';
import { HistoryProvider } from '@/components/HistoryProvider';
import { DemoProvider } from '@/components/DemoProvider';
import { TopNav } from '@/components/TopNav';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { ScannerPage } from '@/pages/ScannerPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { ToolsPage } from '@/pages/ToolsPage';
import { SafetyPage } from '@/pages/SafetyPage';
import { LearnPage } from '@/pages/LearnPage';
import { AboutPage } from '@/pages/AboutPage';

function PageOutlet() {
  const { route } = useRouter();
  switch (route) {
    case 'home':
      return <HomePage />;
    case 'scanner':
      return <ScannerPage />;
    case 'history':
      return <HistoryPage />;
    case 'tools':
      return <ToolsPage />;
    case 'safety':
      return <SafetyPage />;
    case 'learn':
      return <LearnPage />;
    case 'about':
      return <AboutPage />;
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <ToastProvider>
      <RouterProvider>
        <HistoryProvider>
          <DemoProvider>
            <div className="flex min-h-screen flex-col">
              <TopNav />
              <main className="flex-1">
                <PageOutlet />
              </main>
              <Footer />
            </div>
          </DemoProvider>
        </HistoryProvider>
      </RouterProvider>
    </ToastProvider>
  );
}

export default App;
