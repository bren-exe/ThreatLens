import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface DemoContextValue {
  /** when true, scanner should run the scripted demo automatically */
  demoActive: boolean;
  /** payload to auto-load into the scanner when demo launches */
  demoPayload: { text: string; type: 'MESSAGE' | 'EMAIL' | 'URL' } | null;
  launchDemo: (text: string, type: 'MESSAGE' | 'EMAIL' | 'URL') => void;
  endDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [demoActive, setDemoActive] = useState(false);
  const [demoPayload, setDemoPayload] = useState<{ text: string; type: 'MESSAGE' | 'EMAIL' | 'URL' } | null>(null);

  const launchDemo = useCallback((text: string, type: 'MESSAGE' | 'EMAIL' | 'URL') => {
    setDemoPayload({ text, type });
    setDemoActive(true);
  }, []);

  const endDemo = useCallback(() => {
    setDemoActive(false);
    setDemoPayload(null);
  }, []);

  const value = useMemo(() => ({ demoActive, demoPayload, launchDemo, endDemo }), [demoActive, demoPayload, launchDemo, endDemo]);

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
