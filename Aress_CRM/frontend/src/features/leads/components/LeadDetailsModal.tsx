import { useEffect, useMemo, useState } from 'react';
import { Building2, Calendar, Mail, Phone, User } from 'lucide-react';
import { Modal, Badge, Button } from '@/components/ui';
import { api } from '@/services/api';
import type { Lead } from '@/types';

function formatDate(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function LeadDetailsModal({
  leadId,
  isOpen,
  onClose,
  onEdit,
}: {
  leadId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (lead: Lead) => void;
}) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);

  const initials = useMemo(() => {
    const name = lead?.name?.trim() || '';
    if (!name) return '?';
    return name
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  }, [lead?.name]);

  useEffect(() => {
    if (!isOpen || !leadId) return;

    setLoading(true);
    api
      .getLead(leadId)
      .then((data) => setLead(data ?? null))
      .finally(() => setLoading(false));
  }, [isOpen, leadId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lead details"
      subtitle="View lead information"
      size="lg"
    >
      {loading ? (
        <p className="text-[13px] text-slate-400 dark:text-slate-500">
          Loading...
        </p>
      ) : !lead ? (
        <p className="text-[13px] text-slate-400 dark:text-slate-500">
          Lead not found.
        </p>
      ) : (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-[11px] font-semibold">
                {initials}
              </div>

              <div>
                <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
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

            <Badge status={lead.status} />
          </div>

          {/* Info Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
              <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">
                Contact information
              </p>
            </div>

            <div className="px-4 py-3 space-y-3 text-[13px]">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-0.5" />
                <div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-slate-700 dark:text-slate-200">
                    {lead.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-0.5" />
                <div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="text-slate-700 dark:text-slate-200">
                    {lead.phone || '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-0.5" />
                <div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Created
                  </p>
                  <p className="text-slate-700 dark:text-slate-200">
                    {formatDate(lead.createdAt as any)}
                  </p>
                </div>
              </div>

              {lead.ownerName && (
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-slate-300 dark:text-slate-600 mt-0.5" />
                  <div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      Owner
                    </p>
                    <p className="text-slate-700 dark:text-slate-200">
                      {lead.ownerName}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 p-4">
            <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Notes
            </p>

            <p className="text-[13px] text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
              {lead.notes?.trim()
                ? lead.notes
                : <span className="text-slate-400 dark:text-slate-500">No notes added.</span>}
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2">
            {onEdit && (
              <Button size="sm" onClick={() => onEdit(lead)}>
                Edit
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
