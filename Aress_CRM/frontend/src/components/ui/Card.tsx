import { cn } from '@/utils/cn';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, hover = false, padding = 'none', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
        hover && 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-200',
        {
          'p-4': padding === 'sm',
          'p-5': padding === 'md',
          'p-6': padding === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
