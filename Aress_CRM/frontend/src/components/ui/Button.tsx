import { cn } from '@/utils/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, icon, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]',
        {
          'bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus-visible:ring-primary-500 rounded-lg': variant === 'primary',
          'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 focus-visible:ring-slate-400 rounded-lg': variant === 'secondary',
          'bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600 focus-visible:ring-red-500 rounded-lg': variant === 'danger',
          'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus-visible:ring-slate-400 rounded-lg': variant === 'ghost',
          'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 focus-visible:ring-primary-500 rounded-lg': variant === 'outline',
        },
        {
          'px-2 py-1 text-xs gap-1': size === 'xs',
          'px-3 py-1.5 text-[13px]': size === 'sm',
          'px-4 py-2 text-[13px]': size === 'md',
          'px-5 py-2.5 text-sm': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">{icon}</span>}
      {children}
    </button>
  );
}
