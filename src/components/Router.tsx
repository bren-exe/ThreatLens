import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Route = 'home' | 'scanner' | 'tools' | 'history' | 'safety' | 'learn' | 'about';

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

const ROUTE_TO_PATH: Record<Route, string> = {
  home: '/',
  scanner: '/scanner',
  history: '/history',
  tools: '/tools',
  safety: '/safety',
  learn: '/learn',
  about: '/about',
};

const PATH_TO_ROUTE: Record<string, Route> = {
  '/': 'home',
  '/scanner': 'scanner',
  '/history': 'history',
  '/tools': 'tools',
  '/safety': 'safety',
  '/learn': 'learn',
  '/about': 'about',
};

function pathToRoute(path: string): Route {
  const normalized = path.replace(/\/+$/, '') || '/';
  return PATH_TO_ROUTE[normalized] ?? 'home';
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => pathToRoute(window.location.pathname));

  useEffect(() => {
    const onPopState = () => {
      setRoute(pathToRoute(window.location.pathname));
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((r: Route) => {
    setRoute(r);
    const path = ROUTE_TO_PATH[r];
    if (window.location.pathname !== path) {
      window.history.pushState({ route: r }, '', path);
    }
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, []);

  const value = useMemo(() => ({ route, navigate }), [route, navigate]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}
