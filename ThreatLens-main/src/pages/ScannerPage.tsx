import { ScanLine } from 'lucide-react';
import { Scanner } from '@/components/Scanner';

export function ScannerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand">
            <ScanLine className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white">Threat Scanner</h1>
            <p className="text-sm text-slate-400">Analyze suspicious content before you interact with it.</p>
          </div>
        </div>
      </div>
      <Scanner />
    </div>
  );
}
