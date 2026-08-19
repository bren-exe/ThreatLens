import { useEffect, useRef, useState } from 'react';
import { ScanLine, Globe, MessageSquare, Mail, Image, QrCode, Phone, Upload, Loader as Loader2 } from 'lucide-react';
import { analyzeThreat, analyzePhone, DEMO_EXAMPLES } from '@/lib/analyzeThreat';
import type { ScanType, ThreatAnalysis } from '@/lib/types';
import { useHistory } from '@/components/HistoryProvider';
import { useDemo } from '@/components/DemoProvider';
import { useToast } from '@/components/Toast';
import { uid } from '@/lib/history';
import { ThreatResult } from '@/components/ThreatResult';

const TABS: { id: ScanType; label: string; icon: typeof Globe }[] = [
  { id: 'URL', label: 'URL', icon: Globe },
  { id: 'MESSAGE', label: 'Message', icon: MessageSquare },
  { id: 'EMAIL', label: 'Email', icon: Mail },
  { id: 'SCREENSHOT', label: 'Screenshot', icon: Image },
  { id: 'QR', label: 'QR', icon: QrCode },
  { id: 'PHONE', label: 'Phone', icon: Phone },
];

const SCAN_DURATION = 2200;

function scanLabel(text: string, type: ScanType): string {
  const t = text.toLowerCase();
  if (type === 'PHONE') return 'Phone check';
  if (type === 'URL') {
    if (t.includes('bank') || t.includes('login') || t.includes('verify')) return 'Suspicious login page';
    if (t.includes('track') || t.includes('parcel') || t.includes('delivery')) return 'Fake delivery link';
    return 'URL scan';
  }
  if (t.includes('otp')) return 'OTP harvesting';
  if (t.includes('congratulations') || t.includes('won')) return 'Prize scam';
  if (t.includes('kyc')) return 'KYC scam';
  if (t.includes('suspend') || t.includes('bank')) return 'Bank impersonation';
  if (t.includes('upi') || t.includes('₹')) return 'UPI scam';
  return 'Scanned content';
}

function runAnalysis(text: string, type: ScanType): ThreatAnalysis {
  if (type === 'PHONE') return analyzePhone(text);
  return analyzeThreat(text, type);
}

export function Scanner() {
  const [tab, setTab] = useState<ScanType>('URL');
  const [input, setInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ThreatAnalysis | null>(null);
  const [scannedInput, setScannedInput] = useState('');
  const [scannedType, setScannedType] = useState<ScanType>('URL');
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [qrName, setQrName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { add } = useHistory();
  const { demoActive, demoPayload, endDemo } = useDemo();
  const { push } = useToast();

  useEffect(() => {
    if (!demoActive || !demoPayload) return;
    setTab(demoPayload.type);
    setInput(demoPayload.text);
    setScannedInput(demoPayload.text);
    setScannedType(demoPayload.type);
    setScanning(true);
    setResult(null);
    const t = window.setTimeout(() => {
      const analysis = runAnalysis(demoPayload.text, demoPayload.type);
      setResult(analysis);
      setScanning(false);
      add({
        id: uid(),
        date: new Date().toISOString(),
        label: scanLabel(demoPayload.text, demoPayload.type),
        type: demoPayload.type,
        score: analysis.score,
        level: analysis.level,
        preview: demoPayload.text.slice(0, 80),
        categories: analysis.detectedCategories,
      });
      endDemo();
    }, SCAN_DURATION);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoActive, demoPayload]);

  const handleScan = () => {
    if (!input.trim() && tab !== 'SCREENSHOT' && tab !== 'QR') {
      push('warning', 'Nothing to scan', `Paste a ${tab.toLowerCase()} first.`);
      return;
    }
    setScanning(true);
    setResult(null);
    setScannedInput(input);
    setScannedType(tab);
    window.setTimeout(() => {
      const analysis = runAnalysis(input, tab);
      setResult(analysis);
      setScanning(false);
      add({
        id: uid(),
        date: new Date().toISOString(),
        label: scanLabel(input, tab),
        type: tab,
        score: analysis.score,
        level: analysis.level,
        preview: input.slice(0, 80),
        categories: analysis.detectedCategories,
      });
      push(
        analysis.level === 'SAFE' ? 'success' : analysis.level === 'LOW' ? 'info' : 'warning',
        `Scan complete · ${analysis.level}`,
        `Risk score ${analysis.score}/100`,
      );
    }, SCAN_DURATION);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, kind: 'SCREENSHOT' | 'QR') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (kind === 'SCREENSHOT') {
      setScreenshotName(file.name);
      setInput(`Screenshot uploaded: ${file.name}. Extracted text would be analyzed for suspicious URLs, phishing phrases, and threat signals.`);
    } else {
      setQrName(file.name);
      setInput(`QR code uploaded: ${file.name}. Decoded content would be analyzed for suspicious URLs and malicious destinations.`);
    }
    push('info', `${kind === 'SCREENSHOT' ? 'Screenshot' : 'QR code'} loaded`, 'Press analyze to scan the extracted content.');
  };

  const loadDemo = (key: keyof typeof DEMO_EXAMPLES) => {
    const ex = DEMO_EXAMPLES[key];
    setTab(ex.type);
    setInput(ex.text);
    setResult(null);
    push('info', `${ex.label} loaded`, 'Press analyze to scan it.');
  };

  const placeholder =
    tab === 'URL' ? 'Paste a suspicious URL here...' :
    tab === 'MESSAGE' ? 'Paste suspicious message here...' :
    tab === 'EMAIL' ? 'Paste suspicious email content here...' :
    tab === 'PHONE' ? 'Enter a phone number (e.g. +91 98XXX XXXXX)...' :
    '';

  return (
    <div className="space-y-5">
      {/* Scanner card */}
      <div className="surface rounded-xl p-5 sm:p-6">
        <p className="label mb-3">What do you want to check?</p>

        {/* Tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setResult(null); }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  tab === t.id ? 'bg-brand text-white' : 'bg-ink-800 text-slate-400 border border-ink-600 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Input area */}
        {tab === 'SCREENSHOT' ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-ink-600 bg-ink-800 p-6 text-center transition hover:border-brand/50 hover:bg-ink-700/50"
          >
            <Upload className="h-8 w-8 text-slate-500" />
            {screenshotName ? (
              <p className="text-sm text-slate-300">{screenshotName}</p>
            ) : (
              <>
                <p className="text-sm text-slate-400">Click to upload a screenshot</p>
                <p className="text-xs text-slate-600">PNG, JPG up to 5MB</p>
              </>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, 'SCREENSHOT')} />
          </div>
        ) : tab === 'QR' ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-ink-600 bg-ink-800 p-6 text-center transition hover:border-brand/50 hover:bg-ink-700/50"
          >
            <QrCode className="h-8 w-8 text-slate-500" />
            {qrName ? (
              <p className="text-sm text-slate-300">{qrName}</p>
            ) : (
              <>
                <p className="text-sm text-slate-400">Click to upload a QR code image</p>
                <p className="text-xs text-slate-600">PNG, JPG up to 5MB</p>
              </>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e, 'QR')} />
          </div>
        ) : tab === 'EMAIL' ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            maxLength={2000}
            className="textarea min-h-[140px] font-mono text-xs"
            aria-label="Email content input"
          />
        ) : tab === 'PHONE' ? (
          <input
            type="tel"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="input"
            aria-label="Phone number input"
          />
        ) : (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            maxLength={2000}
            className="textarea min-h-[120px]"
            aria-label={`${tab} input`}
          />
        )}

        {tab !== 'SCREENSHOT' && tab !== 'QR' && (
          <div className="mt-2 text-right text-xs text-slate-600">
            {input.length} / 2000 characters
          </div>
        )}

        {/* Scan button */}
        <div className="mt-4">
          <button onClick={handleScan} disabled={scanning} className="btn-primary w-full sm:w-auto">
            {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
            {scanning ? 'Analyzing...' : `Analyze ${tab === 'URL' ? 'Threat' : tab.charAt(0) + tab.slice(1).toLowerCase()}`}
          </button>
        </div>
      </div>

      {/* Demo examples */}
      <div>
        <p className="label mb-2.5">Try a demo</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(DEMO_EXAMPLES) as (keyof typeof DEMO_EXAMPLES)[]).map((key) => {
            const ex = DEMO_EXAMPLES[key];
            return (
              <button key={key} onClick={() => loadDemo(key)} className="btn-ghost text-xs">
                {ex.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result */}
      {scanning && (
        <div className="surface rounded-xl p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm text-slate-400">Analyzing threat signals...</p>
          </div>
        </div>
      )}
      {!scanning && result && (
        <ThreatResult analysis={result} input={scannedInput} type={scannedType} onScanAnother={() => { setInput(''); setResult(null); }} />
      )}
    </div>
  );
}
