export type LeadSource = 'LinkedIn' | 'Referral' | 'Cold Call' | 'Website' | 'Email Campaign' | 'Event' | 'Other';

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Negotiation' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  createdAt: string;
  notes: string;
  ownerName?: string; // For managers to see who created the lead
  ownerId?: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: LeadSource;
  status: LeadStatus;
  notes: string;
}

export const LEAD_SOURCES: LeadSource[] = ['LinkedIn', 'Referral', 'Cold Call', 'Website', 'Email Campaign', 'Event', 'Other'];

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Interested', 'Negotiation', 'Won', 'Lost'];

export const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; border: string; dot: string; solid: string }> = {
  New: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200/60', dot: 'bg-sky-500', solid: '#0ea5e9' },
  Contacted: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/60', dot: 'bg-amber-500', solid: '#f59e0b' },
  Interested: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200/60', dot: 'bg-violet-500', solid: '#8b5cf6' },
  Negotiation: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200/60', dot: 'bg-orange-500', solid: '#f97316' },
  Won: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/60', dot: 'bg-emerald-500', solid: '#10b981' },
  Lost: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/60', dot: 'bg-rose-500', solid: '#f43f5e' },
};
