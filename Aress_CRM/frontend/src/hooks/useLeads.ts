import { useState, useCallback, useEffect } from 'react';
import type { Lead, LeadFormData, LeadStatus } from '@/types';
import { api } from '@/services/api';
import type { HistoryEntry } from '@/services/api';

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await api.getLeads();
    setLeads(data);
    const historyData = await api.getHistory();
    setHistory(historyData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addLead = useCallback(async (data: LeadFormData) => {
    await api.createLead(data);
    refresh();
  }, [refresh]);

  const updateLead = useCallback(async (id: string, data: Partial<LeadFormData>) => {
    await api.updateLead(id, data);
    refresh();
  }, [refresh]);

  const deleteLead = useCallback(async (id: string) => {
    await api.deleteLead(id);
    refresh();
  }, [refresh]);

  const updateStatus = useCallback(async (id: string, status: LeadStatus) => {
    await api.updateLeadStatus(id, status);
    refresh();
  }, [refresh]);

  return {
    leads,
    history,
    isLoading,
    addLead,
    updateLead,
    deleteLead,
    updateStatus,
    refresh,
  };
}
