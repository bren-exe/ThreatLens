import type { RiskLevel } from '@/lib/types';

export const LEVEL_COLORS: Record<RiskLevel, { text: string; bg: string; ring: string; hex: string; glow: string }> = {
  SAFE: {
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    ring: 'ring-emerald-500/30',
    hex: '#10b981',
    glow: 'shadow-[0_0_30px_-8px_rgba(16,185,129,0.6)]',
  },
  LOW: {
    text: 'text-sky-300',
    bg: 'bg-sky-500/10',
    ring: 'ring-sky-500/30',
    hex: '#38bdf8',
    glow: 'shadow-[0_0_30px_-8px_rgba(56,189,248,0.6)]',
  },
  MEDIUM: {
    text: 'text-amber-300',
    bg: 'bg-amber-500/10',
    ring: 'ring-amber-500/30',
    hex: '#f59e0b',
    glow: 'shadow-[0_0_30px_-8px_rgba(245,158,11,0.6)]',
  },
  HIGH: {
    text: 'text-orange-300',
    bg: 'bg-orange-500/10',
    ring: 'ring-orange-500/30',
    hex: '#fb923c',
    glow: 'shadow-[0_0_30px_-8px_rgba(251,146,60,0.6)]',
  },
  CRITICAL: {
    text: 'text-red-300',
    bg: 'bg-red-500/10',
    ring: 'ring-red-500/30',
    hex: '#f43f5e',
    glow: 'shadow-[0_0_30px_-8px_rgba(244,63,94,0.7)]',
  },
};

export const SEVERITY_COLORS = {
  LOW: 'text-sky-300 bg-sky-500/10 ring-1 ring-sky-500/30',
  MEDIUM: 'text-amber-300 bg-amber-500/10 ring-1 ring-amber-500/30',
  HIGH: 'text-orange-300 bg-orange-500/10 ring-1 ring-orange-500/30',
  CRITICAL: 'text-red-300 bg-red-500/10 ring-1 ring-red-500/30',
} as const;

export function levelLabel(level: RiskLevel): string {
  switch (level) {
    case 'SAFE':
      return 'SAFE';
    case 'LOW':
      return 'LOW RISK';
    case 'MEDIUM':
      return 'MEDIUM RISK';
    case 'HIGH':
      return 'HIGH RISK';
    case 'CRITICAL':
      return 'CRITICAL THREAT';
  }
}
