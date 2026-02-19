import { Pencil, Trash2, Building2, Mail, Phone, User, Eye } from 'lucide-react';
import { Badge } from '@/components/ui';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/features/auth';
import type { Lead } from '@/types';

interface LeadRowProps {
  lead: Lead;
  onView: (id: string) => void;  
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isManager?: boolean;
}

export function LeadRow({ lead, onView, onEdit, onDelete, isManager }: LeadRowProps) {
  const { user } = useAuth();
  const { canDeleteLeads } = usePermissions();
  const isOwnLead = lead.ownerId === user?.id;

  return (
    <tr className="group border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors duration-100">
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-[11px] font-semibold shrink-0">
            {lead.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-200 text-[13px] leading-tight">
              {lead.name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Building2 className="w-3 h-3 text-slate-300 dark:text-slate-600" />
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {lead.company}
              </span>
            </div>
          </div>
        </div>
      </td>

      <td className="px-5 py-3.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-slate-300 dark:text-slate-600" />
            <span className="text-[12px] text-slate-500 dark:text-slate-400">
              {lead.email}
            </span>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-slate-300 dark:text-slate-600" />
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                {lead.phone}
              </span>
            </div>
          )}
        </div>
      </td>

      <td className="px-5 py-3.5">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-1 rounded-md font-medium">
          {lead.source}
        </span>
      </td>

      <td className="px-5 py-3.5">
        <Badge status={lead.status} />
      </td>

      {isManager && (
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-1.5">
            <User className="w-3 h-3 text-slate-300 dark:text-slate-600" />
            <span
              className={`text-[11px] font-medium ${
                isOwnLead
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {isOwnLead ? 'You' : (lead.ownerName || 'Unknown')}
            </span>
          </div>
        </td>
      )}

      <td className="px-5 py-3.5">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
          {new Date(lead.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      </td>

      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1">
          {/*View*/}
          <button
            onClick={() => onView(lead.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors duration-150 cursor-pointer"
          >
            <Eye className="w-3 h-3" />
            View
          </button>

          <button
            onClick={() => onEdit(lead)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-md transition-colors duration-150 cursor-pointer"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>

          {canDeleteLeads && (
            <button
              onClick={() => onDelete(lead.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-md transition-colors duration-150 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
