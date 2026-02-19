import { Users, TrendingUp, Trophy, Target, BarChart3, Activity } from 'lucide-react';
import { StatsCard, LeadsChart } from '../components';
import type { Lead } from '@/types';
import type { HistoryEntry } from '@/services/api';

interface DashboardProps {
  leads: Lead[];
  history: HistoryEntry[];
}

export function Dashboard({ leads, history }: DashboardProps) {
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === 'Won').length;
  const lostLeads = leads.filter((l) => l.status === 'Lost').length;
  const activeLeads = leads.filter((l) => !['Won', 'Lost'].includes(l.status)).length;
  const closedLeads = wonLeads + lostLeads;
  const conversionRate = closedLeads > 0 ? Math.round((wonLeads / closedLeads) * 100) : 0;

  const recentHistory = history.slice(0, 5);

  const getActionStyle = (action: HistoryEntry['action']) => {
    switch (action) {
      case 'created': return { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-600', label: 'Created' };
      case 'updated': return { dot: 'bg-blue-400', badge: 'bg-blue-50 text-blue-600', label: 'Updated' };
      case 'deleted': return { dot: 'bg-red-400', badge: 'bg-red-50 text-red-600', label: 'Deleted' };
      case 'status_changed': return { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-600', label: 'Moved' };
    }
  };

  const statusItems = [
    { label: 'New', count: leads.filter((l) => l.status === 'New').length, color: 'bg-indigo-500', light: 'bg-indigo-50' },
    { label: 'Contacted', count: leads.filter((l) => l.status === 'Contacted').length, color: 'bg-amber-500', light: 'bg-amber-50' },
    { label: 'Interested', count: leads.filter((l) => l.status === 'Interested').length, color: 'bg-violet-500', light: 'bg-violet-50' },
    { label: 'Negotiation', count: leads.filter((l) => l.status === 'Negotiation').length, color: 'bg-orange-500', light: 'bg-orange-50' },
    { label: 'Won', count: wonLeads, color: 'bg-emerald-500', light: 'bg-emerald-50' },
    { label: 'Lost', count: lostLeads, color: 'bg-red-500', light: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Overview</h1>
        <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-1">Track your sales pipeline performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={<Users className="w-5 h-5" />}
          color="indigo"
          trend={{ value: 12, label: 'vs last month' }}
        />
        <StatsCard
          title="Active Leads"
          value={activeLeads}
          subtitle="Currently in pipeline"
          icon={<Target className="w-5 h-5" />}
          color="sky"
        />
        <StatsCard
          title="Won Deals"
          value={wonLeads}
          icon={<Trophy className="w-5 h-5" />}
          color="emerald"
          trend={{ value: 8, label: 'vs last month' }}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          subtitle={`${wonLeads} won / ${closedLeads} closed`}
          icon={<TrendingUp className="w-5 h-5" />}
          color="violet"
        />
      </div>

      {/* Charts */}
      <LeadsChart leads={leads} />

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* New Leads (current month, improved design) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 p-5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">New Leads</h3>
            </div>
            <span className="text-[11px] text-slate-300 dark:text-slate-600 tabular-nums">{(() => {
              const now = new Date();
              const month = now.toLocaleString('default', { month: 'short' });
              return month + ' ' + now.getFullYear();
            })()}</span>
          </div>
          <div className="space-y-2">
            {(() => {
              const now = new Date();
              const thisMonth = now.getMonth();
              const thisYear = now.getFullYear();
              const newLeads = leads.filter(l => {
                const d = new Date(l.createdAt);
                return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
              });
              if (newLeads.length === 0) {
                return <div className="text-[13px] text-slate-400 dark:text-slate-500">No new leads this month</div>;
              }
              return newLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg px-3 py-2 transition-colors duration-150 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center text-white font-semibold text-[15px]">
                    {lead.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-slate-800 dark:text-slate-200 truncate">{lead.name}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{lead.email || lead.company || ''}</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 p-5 hover:shadow-sm transition-all duration-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
              </div>
              <h3 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">Recent Activity</h3>
            </div>
            <span className="text-[11px] text-slate-300 dark:text-slate-600 tabular-nums">{history.length} total</span>
          </div>
          {recentHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-3">
                <Activity className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-[13px] font-medium text-slate-400 dark:text-slate-500">No recent activity</p>
              <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-1">Actions will appear here</p>
            </div>
          ) : (
            <div className="space-y-0">
              {recentHistory.map((entry, i) => {
                const style = getActionStyle(entry.action);
                return (
                  <div
                    key={entry.id}
                    className={`flex items-start gap-3 py-2.5 ${
                      i < recentHistory.length - 1 ? 'border-b border-slate-50 dark:border-slate-700' : ''
                    }`}
                  >
                    <div className="mt-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${style.badge}`}>
                          {style.label}
                        </span>
                      </div>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 truncate leading-relaxed">{entry.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-300 dark:text-slate-600 shrink-0 mt-1 tabular-nums">
                      {new Date(entry.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
