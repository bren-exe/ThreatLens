import type { RiskLevel } from '@/lib/types';
import { LEVEL_COLORS, levelLabel } from '@/lib/theme';

export function RiskBadge({ level, size = 'md' }: { level: RiskLevel; size?: 'sm' | 'md' }) {
  const colors = LEVEL_COLORS[level];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`chip ${colors.bg} ${colors.text} border ${colors.border} ${padding} font-semibold`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.hex }} />
      {levelLabel(level)}
    </span>
  );
}
