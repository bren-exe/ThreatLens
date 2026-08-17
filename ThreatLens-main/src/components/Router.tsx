import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Route = 'dashboard' | 'scanner' | 'history' | 'safety' | 'about';

interface RouterContextValue {
  route: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('dashboard');

  const navigate = useCallback((r: Route) => {
    setRoute(r);
    // scroll main content to top on navigation
    requestAnimationFrame(() => {
      document.getElementById('main-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, []);

  const value = useMemo(() => ({ route, navigate }), [route, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}
