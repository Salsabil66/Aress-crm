import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'violet' | 'sky';
}

const colorMap = {
  indigo: {
    iconBg: 'bg-indigo-50',
    iconText: 'text-indigo-500',
    accent: '#6366f1',
  },
  emerald: {
    iconBg: 'bg-emerald-50',
    iconText: 'text-emerald-500',
    accent: '#10b981',
  },
  amber: {
    iconBg: 'bg-amber-50',
    iconText: 'text-amber-500',
    accent: '#f59e0b',
  },
  rose: {
    iconBg: 'bg-rose-50',
    iconText: 'text-rose-500',
    accent: '#f43f5e',
  },
  violet: {
    iconBg: 'bg-violet-50',
    iconText: 'text-violet-500',
    accent: '#8b5cf6',
  },
  sky: {
    iconBg: 'bg-sky-50',
    iconText: 'text-sky-500',
    accent: '#0ea5e9',
  },
};

export function StatsCard({ title, value, subtitle, icon, trend, color = 'indigo' }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg transition-all duration-200 group flex flex-col gap-2 relative">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-12 h-12 rounded-xl ${colors.iconBg} ${colors.iconText} flex items-center justify-center text-[22px]`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[12px] font-semibold tabular-nums ${
            trend.value >= 0 ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {trend.value >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trend.value >= 0 ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">{value}</p>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-semibold">{title}</p>
        {subtitle && (
          <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
        )}
        {trend && (
          <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-1">{trend.label}</p>
        )}
      </div>
      {/* Accent hover line */}
      <div className="absolute left-0 bottom-0 w-full h-[3px] rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${colors.accent}, transparent)` }}
      />
    </div>
  );
}
