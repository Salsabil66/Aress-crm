import type { Lead, LeadStatus } from '@/types';
import { LEAD_STATUSES } from '@/types';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

export function KanbanBoard({ leads, onStatusChange }: KanbanBoardProps) {
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: LeadStatus) => {
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      const lead = leads.find((l) => l.id === leadId);
      if (lead && lead.status !== status) {
        onStatusChange(leadId, status);
      }
    }
  };

  const grouped = LEAD_STATUSES.reduce(
    (acc, status) => {
      acc[status] = leads.filter((l) => l.status === status);
      return acc;
    },
    {} as Record<LeadStatus, Lead[]>
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
      {LEAD_STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          leads={grouped[status]}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
