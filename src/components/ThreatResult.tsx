import { useState } from 'react';
import { TriangleAlert as AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, Brain, ShieldX, KeyRound, Link2, Clock, Drama, Wallet, Sparkles, Phone } from 'lucide-react';
import type { Indicator, IndicatorSeverity, ScanType, ThreatAnalysis } from '@/lib/types';
import { RiskMeter } from '@/components/RiskMeter';
import { LEVEL_COLORS, SEVERITY_COLORS } from '@/lib/theme';

const INDICATOR_ICONS: Record<string, typeof AlertTriangle> = {
  'otp-request': KeyRound,
  'password-request': KeyRound,
  'bank-card-request': Wallet,
  'financial-payment': Wallet,
  'prize-scam': Sparkles,
  urgency: Clock,
  'account-suspension': AlertTriangle,
  impersonation: Drama,
  'suspicious-url': Link2,
  'http-url': Link2,
  'url-shortener': Link2,
  'suspicious-domain': Link2,
  'unrealistic-offer': Sparkles,
  'personal-info-request': KeyRound,
  'grammar-oddity': AlertTriangle,
  'support-impersonation': Drama,
  'intl-number': Phone,
  'short-number': Phone,
};

function severityRank(s: IndicatorSeverity): number {
  return { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 }[s];
}

function IndicatorRow({ indicator, index }: { indicator: Indicator; index: number }) {
  const Icon = INDICATOR_ICONS[indicator.id] ?? AlertTriangle;
  return (
    <div className="surface-2 rounded-lg p-4 animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="flex items-start gap-3">
        <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${SEVERITY_COLORS[indicator.severity]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-200">{indicator.label}</p>
            <span className={`chip ${SEVERITY_COLORS[indicator.severity]} text-[10px] font-semibold`}>{indicator.severity}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">{indicator.detail}</p>
        </div>
      </div>
    </div>
  );
}

interface ThreatResultProps {
  analysis: ThreatAnalysis;
  input: string;
  type: ScanType;
  onScanAnother?: () => void;
}

export function ThreatResult({ analysis, input, type, onScanAnother }: ThreatResultProps) {
  const [showActions, setShowActions] = useState(true);
  const colors = LEVEL_COLORS[analysis.level];
  const sortedIndicators = [...analysis.indicators].sort((a, b) => severityRank(b.severity) - severityRank(a.severity));
  const isUrl = type === 'URL';
  const hasUrl = /\bhttps?:\/\//i.test(input);

  // Extract domain for URL scans
  let domain = '';
  if (isUrl || hasUrl) {
    const match = input.match(/https?:\/\/([^/\s]+)/i);
    if (match) domain = match[1];
  }
  const isHttps = /^https:\/\//i.test(input.trim());

  return (
    <div className="space-y-4 animate-scale-in">
      {/* Main assessment */}
      <div className={`surface rounded-xl border-l-4 ${colors.border} p-5 sm:p-6`} style={{ borderLeftColor: colors.hex }}>
        <p className="label mb-3">Threat Assessment</p>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <RiskMeter score={analysis.score} level={analysis.level} size={140} />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              {analysis.level === 'SAFE' ? (
                <ShieldCheck className={`h-5 w-5 ${colors.text}`} />
              ) : (
                <AlertTriangle className={`h-5 w-5 ${colors.text}`} />
              )}
              <span className={`font-display text-xl font-bold ${colors.text}`}>
                {analysis.level === 'SAFE' ? 'No Threat Detected' : analysis.level + ' RISK'}
              </span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-wider text-slate-500">Risk Score · {analysis.score} / 100</p>
            {analysis.detectedCategories.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                {analysis.detectedCategories.map((cat) => (
                  <span key={cat} className="chip bg-ink-800 text-slate-400 border border-ink-600 capitalize">
                    {cat.replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* URL-specific details */}
      {(isUrl || hasUrl) && domain && (
        <div className="surface rounded-xl p-5">
          <p className="label mb-3">URL Details</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="surface-2 rounded-lg p-3">
              <p className="text-xs text-slate-500">Domain</p>
              <p className="mt-1 font-mono text-sm text-slate-200 break-all">{domain}</p>
            </div>
            <div className="surface-2 rounded-lg p-3">
              <p className="text-xs text-slate-500">HTTPS</p>
              <p className={`mt-1 text-sm font-medium ${isHttps ? 'text-safe' : 'text-critical'}`}>
                {isHttps ? 'Encrypted (HTTPS)' : 'Not encrypted (HTTP)'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Evidence */}
      {sortedIndicators.length > 0 && (
        <div className="surface rounded-xl p-5">
          <p className="label mb-1">Why We Flagged This</p>
          <p className="mb-4 text-xs text-slate-500">{sortedIndicators.length} indicator{sortedIndicators.length !== 1 ? 's' : ''} detected</p>
          <div className="space-y-2.5">
            {sortedIndicators.map((ind, i) => (
              <IndicatorRow key={ind.id} indicator={ind} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* AI explanation */}
      <div className="surface rounded-xl p-5">
        <p className="label mb-2 flex items-center gap-1.5"><Brain className="h-3.5 w-3.5" /> AI-Assisted Explanation</p>
        <p className="text-sm leading-relaxed text-slate-300">{analysis.explanation}</p>
      </div>

      {/* Risk breakdown */}
      {(analysis.breakdown.socialEngineering > 0 || analysis.breakdown.urlRisk > 0 || analysis.breakdown.credentialRisk > 0 || analysis.breakdown.financialRisk > 0) && (
        <div className="surface rounded-xl p-5">
          <p className="label mb-3">Risk Breakdown</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: 'Social Engineering', value: analysis.breakdown.socialEngineering, color: '#F59E0B' },
              { label: 'URL Risk', value: analysis.breakdown.urlRisk, color: '#3B82F6' },
              { label: 'Credential Risk', value: analysis.breakdown.credentialRisk, color: '#F97316' },
              { label: 'Financial Risk', value: analysis.breakdown.financialRisk, color: '#EF4444' },
            ].map((b) => (
              <div key={b.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-300">{b.label}</span>
                  <span className="tabular-nums text-slate-500">{b.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-700">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${b.value}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="surface rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="label">What You Should Do</p>
            <p className="mt-0.5 text-xs text-slate-500">Recommended safe actions</p>
          </div>
          <button
            onClick={() => setShowActions((v) => !v)}
            className="btn-ghost text-xs"
          >
            {showActions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showActions ? 'Hide' : 'Show'}
          </button>
        </div>
        {showActions && (
          <ul className="mt-4 space-y-2 animate-fade-in">
            {analysis.recommendations.length === 0 ? (
              <li className="flex items-start gap-3 surface-2 rounded-lg p-3 text-sm text-safe">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                No action needed — this content appears safe. Stay alert and keep good security habits.
              </li>
            ) : (
              analysis.recommendations.map((r) => (
                <li key={r.id} className="flex items-start gap-3 surface-2 rounded-lg p-3 text-sm text-slate-300 animate-fade-in">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-safe" />
                  {r.text}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Analyzed content */}
      <div className="surface rounded-xl p-5">
        <p className="label mb-2">Analyzed Content</p>
        <p className="max-h-32 overflow-y-auto whitespace-pre-wrap rounded-lg border border-ink-600 bg-ink-800 p-3 font-mono text-xs text-slate-400">
          {input}
        </p>
      </div>

      {/* Scan another */}
      {onScanAnother && (
        <button onClick={onScanAnother} className="btn-ghost w-full">
          <ShieldX className="h-4 w-4" /> Scan Another Threat
        </button>
      )}
    </div>
  );
}
