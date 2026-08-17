import { useEffect, useState } from 'react';
import type { RiskLevel } from '@/lib/types';
import { LEVEL_COLORS } from '@/lib/theme';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

/** Circular animated risk meter using SVG stroke-dashoffset. */
export function RiskMeter({ score, level, size = 200 }: RiskMeterProps) {
  const [displayed, setDisplayed] = useState(0);
  const colors = LEVEL_COLORS[level];
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    setDisplayed(0);
    const start = performance.now();
    const duration = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(eased * score));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const offset = circumference - (displayed / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`meter-grad-${level}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.hex} stopOpacity="0.7" />
            <stop offset="100%" stopColor={colors.hex} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#meter-grad-${level})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 8px ${colors.hex}aa)`, transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-4xl font-bold text-white tabular-nums">{displayed}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">/ 100</span>
        <span className={`mt-1 text-xs font-semibold uppercase tracking-wider ${colors.text}`}>{level}</span>
      </div>
    </div>
  );
}
