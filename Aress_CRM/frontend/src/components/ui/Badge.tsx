import { cn } from '@/utils/cn';
import type { LeadStatus } from '@/types';
import { STATUS_COLORS } from '@/types';

interface BadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

export function Badge({ status, size = 'md' }: BadgeProps) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-md',
        colors.bg,
        colors.text,
        {
          'px-1.5 py-0.5 text-[10px]': size === 'sm',
          'px-2 py-[3px] text-[11px]': size === 'md',
        }
      )}
    >
      <span className={cn('w-[5px] h-[5px] rounded-full', colors.dot)} />
      {status}
    </span>
  );
}
