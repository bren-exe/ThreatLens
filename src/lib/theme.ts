import type { RiskLevel } from '@/lib/types';

export const LEVEL_COLORS: Record<RiskLevel, { text: string; bg: string; border: string; hex: string; label: string }> = {
  SAFE: {
    text: 'text-safe',
    bg: 'bg-safe/10',
    border: 'border-safe/30',
    hex: '#22C55E',
    label: 'SAFE',
  },
  LOW: {
    text: 'text-brand-light',
    bg: 'bg-brand/10',
    border: 'border-brand/30',
    hex: '#3B82F6',
    label: 'LOW RISK',
  },
  MEDIUM: {
    text: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    hex: '#F59E0B',
    label: 'MEDIUM RISK',
  },
  HIGH: {
    text: 'text-high',
    bg: 'bg-high/10',
    border: 'border-high/30',
    hex: '#F97316',
    label: 'HIGH RISK',
  },
  CRITICAL: {
    text: 'text-critical',
    bg: 'bg-critical/10',
    border: 'border-critical/30',
    hex: '#EF4444',
    label: 'CRITICAL',
  },
};

export const SEVERITY_COLORS = {
  LOW: 'text-brand-light bg-brand/10 border border-brand/30',
  MEDIUM: 'text-warning bg-warning/10 border border-warning/30',
  HIGH: 'text-high bg-high/10 border border-high/30',
  CRITICAL: 'text-critical bg-critical/10 border border-critical/30',
} as const;

export function levelLabel(level: RiskLevel): string {
  return LEVEL_COLORS[level].label;
}
