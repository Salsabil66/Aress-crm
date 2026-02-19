import { useState, useEffect } from 'react';
import { Input, Select, Textarea, Button } from '@/components/ui';
import type { Lead, LeadFormData } from '@/types';
import { LEAD_SOURCES, LEAD_STATUSES } from '@/types';

interface LeadFormProps {
  lead?: Lead | null;
  onSubmit: (data: LeadFormData) => void;
  onCancel: () => void;
}

const emptyForm: LeadFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  source: 'LinkedIn',
  status: 'New',
  notes: '',
};

export function LeadForm({ lead, onSubmit, onCancel }: LeadFormProps) {
  const [form, setForm] = useState<LeadFormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        source: lead.source,
        status: lead.status,
        notes: lead.notes,
      });
    }
  }, [lead]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.company.trim()) newErrors.company = 'Company is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Name *"
          placeholder="John Doe"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          error={errors.name}
        />
        <Input
          label="Email *"
          type="email"
          placeholder="john@company.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          error={errors.email}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone"
          placeholder="+1 555-0100"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        />
        <Input
          label="Company *"
          placeholder="Acme Corp"
          value={form.company}
          onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
          error={errors.company}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Source"
          value={form.source}
          onChange={e => setForm(f => ({ ...f, source: e.target.value as LeadFormData['source'] }))}
          options={LEAD_SOURCES.map(s => ({ value: s, label: s }))}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={e => setForm(f => ({ ...f, status: e.target.value as LeadFormData['status'] }))}
          options={LEAD_STATUSES.map(s => ({ value: s, label: s }))}
        />
      </div>
      <Textarea
        label="Notes"
        placeholder="Add any relevant notes..."
        value={form.notes}
        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
      />
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{lead ? 'Update Lead' : 'Add Lead'}</Button>
      </div>
    </form>
  );
}
