import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Select } from '@/components/ui';
import { LeadRow } from './LeadRow';
import type { Lead, LeadStatus, LeadSource } from '@/types';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/types';
import { useAuth } from '@/features/auth';

interface LeadTableProps {
  leads: Lead[];
  onView: (id: string) => void;    
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

export function LeadTable({ leads, onView, onEdit, onDelete }: LeadTableProps) {
  const { user } = useAuth();
  const isManager = user?.role === 'manager' || user?.role === 'admin';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = statusFilter !== 'All' || sourceFilter !== 'All';

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || lead.status === statusFilter;

    const matchesSource =
      sourceFilter === 'All' || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const clearFilters = () => {
    setStatusFilter('All');
    setSourceFilter('All');
  };

  return (
    <div className="space-y-3">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <input
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-[13px] text-slate-700 dark:text-slate-300 placeholder-slate-300 dark:placeholder-slate-600 focus:border-primary-300 dark:focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500/10 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-300 hover:text-slate-500 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-3 py-2 text-[13px] font-medium border rounded-lg transition-all duration-150 cursor-pointer ${
            showFilters || hasActiveFilters
              ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400'
              : 'border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="flex flex-wrap items-end gap-3 p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 animate-fade-in-up">
          <div className="w-44">
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as LeadStatus | 'All')
              }
              options={[
                { value: 'All', label: 'All Statuses' },
                ...LEAD_STATUSES.map((s) => ({ value: s, label: s })),
              ]}
            />
          </div>

          <div className="w-44">
            <Select
              label="Source"
              value={sourceFilter}
              onChange={(e) =>
                setSourceFilter(e.target.value as LeadSource | 'All')
              }
              options={[
                { value: 'All', label: 'All Sources' },
                ...LEAD_SOURCES.map((s) => ({ value: s, label: s })),
              ]}
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2.5 text-[12px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                {isManager && (
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Owner
                  </th>
                )}
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={isManager ? 7 : 6}
                    className="px-5 py-16 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center mb-3">
                        <Search className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                      </div>
                      <p className="text-[13px] text-slate-400 dark:text-slate-500 font-medium">
                        No leads found
                      </p>
                      <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-0.5">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onView={onView}      
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isManager={isManager}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-2.5 border-t border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Showing{' '}
            <span className="font-medium text-slate-600 dark:text-slate-400">
              {filtered.length}
            </span>{' '}
            of {leads.length} leads
          </p>
        </div>
      </div>
    </div>
  );
}
