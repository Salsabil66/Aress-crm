import { useState, useEffect } from 'react';
import { UserCog, Pencil, Trash2, Shield } from 'lucide-react';
import { getAllUsers, updateUserInfo, deleteUser, type UserListItem } from '../admin.service';
import { UserEditModal } from '../components';
import type { User } from '@/features/auth/auth.types';
import { useAuth } from '@/features/auth';

export function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const userList = await getAllUsers();
    setUsers(userList);
    setLoading(false);
  };

  const handleSave = async (userId: string, updates: { name: string; email: string; role: User['role'] }) => {
    const result = await updateUserInfo(userId, updates);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'User updated successfully' });
      loadUsers();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to update user' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (userId: string, userName: string) => {
    if (userId === currentUser?.id) {
      setMessage({ type: 'error', text: 'You cannot delete your own account' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    const result = await deleteUser(userId);
    
    if (result.success) {
      setMessage({ type: 'success', text: 'User deleted successfully' });
      loadUsers();
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to delete user' });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };


  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin', color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/30' };
      case 'manager':
        return { label: 'Manager', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/30' };
      case 'sales_rep':
        return { label: 'Sales Rep', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30' };
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">User Management</h1>
        <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-1">Manage user accounts and permissions</p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30'
        }`}>
          <p className={`text-[13px] ${
            message.type === 'success' 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-slate-400 dark:text-slate-500">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center mb-4">
              <UserCog className="w-5 h-5 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-5 py-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                {users.map((user) => {
                  const badge = getRoleBadge(user.role);
                  const isCurrentUser = user.id === currentUser?.id;
                  
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors duration-100">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-[11px] font-semibold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200 text-[13px]">
                              {user.name}
                              {isCurrentUser && <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1.5">(You)</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] text-slate-500 dark:text-slate-400">{user.email}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-md border ${badge.color}`}>
                          <Shield className="w-3 h-3" />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 tabular-nums">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 rounded-md transition-colors duration-150 cursor-pointer"
                          >
                            <Pencil className="w-3 h-3" />
                            Edit
                          </button>
                          {!isCurrentUser && (
                            <button
                              onClick={() => handleDelete(user.id, user.name)}
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
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
