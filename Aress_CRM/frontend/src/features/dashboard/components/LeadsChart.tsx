import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { Lead } from '@/types';
import { LEAD_STATUSES } from '@/types';
import { TrendingUp, PieChart as PieIcon, Share2 } from 'lucide-react';

interface LeadsChartProps {
  leads: Lead[];
}

const PIE_COLORS: Record<string, string> = {
  New: '#6366f1',
  Contacted: '#f59e0b',
  Interested: '#8b5cf6',
  Negotiation: '#f97316',
  Won: '#10b981',
  Lost: '#ef4444',
};

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #f1f5f9',
  borderRadius: '10px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
  fontSize: '12px',
  padding: '8px 12px',
};

export function LeadsChart({ leads }: LeadsChartProps) {
  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {};
    leads.forEach((lead) => {
      const date = new Date(lead.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[key] = (months[key] || 0) + 1;
    });

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => {
        const [year, m] = month.split('-');
        const date = new Date(Number(year), Number(m) - 1);
        return {
          month: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          leads: count,
        };
      });
  }, [leads]);

  const statusData = useMemo(() => {
    return LEAD_STATUSES.map((status) => ({
      name: status,
      value: leads.filter((l) => l.status === status).length,
      color: PIE_COLORS[status],
    })).filter((d) => d.value > 0);
  }, [leads]);

  const sourceData = useMemo(() => {
    const sources: Record<string, number> = {};
    leads.forEach((lead) => {
      sources[lead.source] = (sources[lead.source] || 0) + 1;
    });
    return Object.entries(sources)
      .sort(([, a], [, b]) => b - a)
      .map(([source, count]) => ({ source, count }));
  }, [leads]);

  const totalForPie = statusData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Monthly Evolution */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 p-5 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">Lead Evolution</h3>
              <p className="text-[11px] text-slate-300 dark:text-slate-600">Monthly new leads</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md tabular-nums">
            {leads.length} total
          </span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                dx={-4}
                width={28}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#colorLeads)"
                dot={{ r: 3, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Breakdown (bar/progress, dashboard style) */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 p-5 hover:shadow-sm transition-all duration-200">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
              <PieIcon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">Status Pepeline</h3>
          </div>
          <span className="text-[11px] text-slate-300 dark:text-slate-600 tabular-nums">{leads.length} leads</span>
        </div>
        <div className="space-y-3.5">
          {[
            { label: 'New', color: 'bg-indigo-500', light: 'bg-indigo-50' },
            { label: 'Contacted', color: 'bg-amber-500', light: 'bg-amber-50' },
            { label: 'Interested', color: 'bg-violet-500', light: 'bg-violet-50' },
            { label: 'Negotiation', color: 'bg-orange-500', light: 'bg-orange-50' },
            { label: 'Won', color: 'bg-emerald-500', light: 'bg-emerald-50' },
            { label: 'Lost', color: 'bg-red-500', light: 'bg-red-50' },
          ].map((item) => {
            const count = leads.filter((l) => l.status === item.label).length;
            return (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 tabular-nums">{count}</span>
                    <span className="text-[10px] text-slate-300 dark:text-slate-600 tabular-nums w-7 text-right">
                      {leads.length > 0 ? Math.round((count / leads.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <div className={`w-full rounded-full h-1 ${item.light} overflow-hidden`}>
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500 ease-out`}
                    style={{ width: `${leads.length > 0 ? Math.max((count / leads.length) * 100, count > 0 ? 3 : 0) : 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Source Distribution removed per request */}
    </div>
  );
}
