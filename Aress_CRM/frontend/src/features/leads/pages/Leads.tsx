import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { LeadTable, LeadForm } from '../components';
import { LeadDetailsModal } from '../components/LeadDetailsModal';
import type { Lead, LeadFormData } from '@/types';

interface LeadsPageProps {
  leads: Lead[];
  onAdd: (data: LeadFormData) => void;
  onUpdate: (id: string, data: Partial<LeadFormData>) => void;
  onDelete: (id: string) => void;
  onToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function Leads({ leads, onAdd, onUpdate, onDelete, onToast }: LeadsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // View details
  const [viewId, setViewId] = useState<string | null>(null);

  const handleAdd = (data: LeadFormData) => {
    onAdd(data);
    setIsModalOpen(false);
    onToast?.('success', `Lead "${data.name}" has been added successfully!`);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleUpdate = (data: LeadFormData) => {
    if (editingLead) {
      onUpdate(editingLead.id, data);
      setEditingLead(null);
      setIsModalOpen(false);
      onToast?.('success', `Lead "${data.name}" has been updated successfully!`);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      const lead = leads.find((l) => l.id === deleteConfirm);
      onDelete(deleteConfirm);
      setDeleteConfirm(null);
      onToast?.('success', `Lead "${lead?.name || ''}" has been deleted.`);
    }
  };

  const deleteLeadName = deleteConfirm ? leads.find((l) => l.id === deleteConfirm)?.name : '';

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Leads</h1>
          <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-0.5">Manage and track all your leads</p>
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setEditingLead(null);
            setIsModalOpen(true);
          }}
        >
          Add Lead
        </Button>
      </div>

      {/*UPDATED: pass onView */}
      <LeadTable
        leads={leads}
        onView={(id) => setViewId(id)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
        subtitle={editingLead ? `Editing ${editingLead.name}` : 'Fill in the details below'}
        size="lg"
      >
        <LeadForm
          lead={editingLead}
          onSubmit={editingLead ? handleUpdate : handleAdd}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingLead(null);
          }}
        />
      </Modal>

      {/*Lead Details Modal */}
      <LeadDetailsModal
        leadId={viewId}
        isOpen={!!viewId}
        onClose={() => setViewId(null)}
      />

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Lead"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-100 dark:border-red-900/50">
            <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] text-slate-700 dark:text-slate-300">
                Are you sure you want to delete <span className="font-semibold">{deleteLeadName}</span>?
              </p>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">This action cannot be undone.</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Delete Lead
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
