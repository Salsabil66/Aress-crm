import { supabase } from '@/lib/supabase';
import type { Lead, LeadFormData, LeadStatus } from '@/types';

export interface HistoryEntry {
  id: string;
  leadId: string;
  leadName: string;
  action: 'created' | 'updated' | 'deleted' | 'status_changed';
  details: string;
  timestamp: string;
}

async function addHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): Promise<void> {
  try {
    await supabase.from('history').insert({
      lead_id: entry.leadId,
      lead_name: entry.leadName,
      action: entry.action,
      details: entry.details,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error adding history:', error);
  }
}

export const api = {
  getLeads: async (): Promise<Lead[]> => {
    try {
      // Fetch leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;
      
      if (!leadsData || leadsData.length === 0) return [];

      // Get unique user IDs
      const userIds = [...new Set(leadsData.map(lead => lead.user_id))];
      
      // Fetch user profiles for these IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
      }

      // Create a map of user_id to name
      const userMap = new Map(profilesData?.map(p => [p.id, p.name]) || []);

      return leadsData.map(lead => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        source: lead.source,
        status: lead.status,
        notes: lead.notes,
        createdAt: lead.created_at,
        ownerName: userMap.get(lead.user_id),
        ownerId: lead.user_id,
      }));
    } catch (error) {
      console.error('Error fetching leads:', error);
      return [];
    }
  },

  getLead: async (id: string): Promise<Lead | undefined> => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        source: data.source,
        status: data.status,
        notes: data.notes,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error fetching lead:', error);
      return undefined;
    }
  },

  createLead: async (formData: LeadFormData): Promise<Lead | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('leads')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          source: formData.source,
          status: formData.status,
          notes: formData.notes,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newLead: Lead = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        source: data.source,
        status: data.status,
        notes: data.notes,
        createdAt: data.created_at,
      };

      await addHistory({
        leadId: newLead.id,
        leadName: newLead.name,
        action: 'created',
        details: `Lead "${newLead.name}" from ${newLead.company} was created`,
      });

      return newLead;
    } catch (error) {
      console.error('Error creating lead:', error);
      return null;
    }
  },

  updateLead: async (id: string, formData: Partial<LeadFormData>): Promise<Lead | undefined> => {
    try {
      // Get old lead for history
      const { data: oldData } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      const { data, error } = await supabase
        .from('leads')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          source: formData.source,
          status: formData.status,
          notes: formData.notes,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedLead: Lead = {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        source: data.source,
        status: data.status,
        notes: data.notes,
        createdAt: data.created_at,
      };

      if (formData.status && oldData && formData.status !== oldData.status) {
        await addHistory({
          leadId: id,
          leadName: updatedLead.name,
          action: 'status_changed',
          details: `Status changed from "${oldData.status}" to "${formData.status}"`,
        });
      } else {
        await addHistory({
          leadId: id,
          leadName: updatedLead.name,
          action: 'updated',
          details: `Lead "${updatedLead.name}" was updated`,
        });
      }

      return updatedLead;
    } catch (error) {
      console.error('Error updating lead:', error);
      return undefined;
    }
  },

  deleteLead: async (id: string): Promise<boolean> => {
    try {
      // Get lead for history
      const { data: lead } = await supabase
        .from('leads')
        .select('name')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (lead) {
        await addHistory({
          leadId: id,
          leadName: lead.name,
          action: 'deleted',
          details: `Lead "${lead.name}" was deleted`,
        });
      }

      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      return false;
    }
  },

  updateLeadStatus: async (id: string, status: LeadStatus): Promise<Lead | undefined> => {
    return api.updateLead(id, { status });
  },

  getHistory: async (): Promise<HistoryEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      return (data || []).map(entry => ({
        id: entry.id,
        leadId: entry.lead_id,
        leadName: entry.lead_name,
        action: entry.action,
        details: entry.details,
        timestamp: entry.timestamp,
      }));
    } catch (error) {
      console.error('Error fetching history:', error);
      return [];
    }
  },
};
