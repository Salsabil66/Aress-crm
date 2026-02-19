import { supabase } from '@/lib/supabase';
import type { User } from '@/features/auth/auth.types';

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: User['role'];
  createdAt: string;
}

export async function getAllUsers(): Promise<UserListItem[]> {
  try {
    // Query the user_profiles table
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      role: item.role,
      createdAt: item.created_at || item.createdAt,
    }));
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
}

export async function updateUserInfo(userId: string, updates: { name?: string; email?: string; role?: User['role'] }): Promise<{ success: boolean; error?: string }> {
  try {
    // Update user profile in database
    const { error } = await supabase
      .from('user_profiles')
      .update({
        name: updates.name,
        role: updates.role,
      })
      .eq('id', userId);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update user' };
  }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Deleting user:', userId);

    // Use raw fetch with anon key as Bearer token
    const functionUrl = 'https://bbhfprqngufzeoscwcag.supabase.co/functions/v1/delete-user';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaGZwcnFuZ3VmemVvc2N3Y2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTUwNjYsImV4cCI6MjA4NjY3MTA2Nn0.S5FJdhow2mJBeLJ_dAfdnY2nIAYI8T2WnEWFhmqhzmY';
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();
    console.log('Delete response:', response.status, data);

    if (!response.ok) {
      console.error('Error deleting auth user:', data);
      return { success: false, error: data.error || 'Failed to delete user' };
    }

    // If auth deletion succeeded, also delete from user_profiles
    const { error: dbError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    if (dbError) {
      return { success: false, error: dbError.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}

