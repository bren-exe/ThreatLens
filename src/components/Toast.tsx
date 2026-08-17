import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { CircleCheck as CheckCircle2, Info, TriangleAlert as AlertTriangle, Circle as XCircle, X } from 'lucide-react';

type ToastKind = 'success' | 'info' | 'warning' | 'error';

interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  message?: string;
}

interface ToastContextValue {
  push: (kind: ToastKind, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const ICONS: Record<ToastKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const STYLES: Record<ToastKind, string> = {
  success: 'border-safe/30 text-safe',
  info: 'border-brand/30 text-brand',
  warning: 'border-warning/30 text-warning',
  error: 'border-critical/30 text-critical',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, title: string, message?: string) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t, { id, kind, title, message }]);
      window.setTimeout(() => remove(id), 4000);
    },
    [remove],
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = ICONS[t.kind];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto surface-2 flex items-start gap-3 rounded-lg p-3.5 pr-2 animate-slide-down ${STYLES[t.kind]}`}
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{t.title}</p>
                {t.message && <p className="mt-0.5 text-xs text-slate-400">{t.message}</p>}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="rounded-lg p-1 text-slate-500 hover:bg-white/5 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
