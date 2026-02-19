import { KanbanBoard } from '../components';
import type { Lead, LeadStatus } from '@/types';

interface PipelinePageProps {
  leads: Lead[];
  onStatusChange: (leadId: string, status: LeadStatus) => void;
}

export function Pipeline({ leads, onStatusChange }: PipelinePageProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Pipeline</h1>
          <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-0.5">
            Drag and drop leads to update their status
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 rounded-lg px-3 py-2">
          <span className="font-semibold text-slate-600 dark:text-slate-400 tabular-nums">{leads.length}</span>
          <span>total leads</span>
        </div>
      </div>
      <KanbanBoard leads={leads} onStatusChange={onStatusChange} />
    </div>
  );
}
