import { useEffect, useState } from 'react';
import type { RiskLevel } from '@/lib/types';
import { LEVEL_COLORS } from '@/lib/theme';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

export function RiskMeter({ score, level, size = 140 }: RiskMeterProps) {
  const [displayed, setDisplayed] = useState(0);
  const colors = LEVEL_COLORS[level];
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    setDisplayed(0);
    const start = performance.now();
    const duration = 800;
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
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.hex}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.1s linear' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-display text-3xl font-bold text-white tabular-nums">{displayed}</span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">/ 100</span>
      </div>
    </div>
  );
}
