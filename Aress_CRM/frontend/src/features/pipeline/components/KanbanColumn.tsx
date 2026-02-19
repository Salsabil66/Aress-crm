import { useState } from 'react';
import type { Lead, LeadStatus } from '@/types';
import { STATUS_COLORS } from '@/types';
import { LeadCard } from './LeadCard';

interface KanbanColumnProps {
  status: LeadStatus;
  leads: Lead[];
  onDragStart: (e: React.DragEvent, leadId: string) => void;
  onDrop: (e: React.DragEvent, status: LeadStatus) => void;
}

export function KanbanColumn({ status, leads, onDragStart, onDrop }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const colors = STATUS_COLORS[status];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, status);
  };

  return (
    <div
      className={`flex flex-col min-w-[260px] max-w-[280px] rounded-xl transition-all duration-150 ${
        isDragOver
          ? 'bg-primary-50/40 dark:bg-primary-900/20 ring-1 ring-primary-200 dark:ring-primary-800 ring-inset'
          : 'bg-slate-50/50 dark:bg-slate-800/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="px-3 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
          <h3 className="font-semibold text-[12px] text-slate-600 dark:text-slate-400">{status}</h3>
        </div>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-600 tabular-nums">
          {leads.length}
        </span>
      </div>
      <div className="flex-1 px-2 pb-2 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[80px]">
        {leads.length === 0 && (
          <div className={`flex items-center justify-center h-16 border border-dashed rounded-lg transition-colors duration-150 ${
            isDragOver ? 'border-primary-300 dark:border-primary-700 bg-primary-50/20 dark:bg-primary-900/20' : 'border-slate-200 dark:border-slate-700'
          }`}>
            <p className="text-[11px] text-slate-300 dark:text-slate-600">Drop leads here</p>
          </div>
        )}
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onDragStart={onDragStart} />
        ))}
      </div>
    </div>
  );
}
