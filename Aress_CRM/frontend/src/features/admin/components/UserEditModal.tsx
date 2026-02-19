import { useState } from 'react';
import { Save } from 'lucide-react';
import { Modal } from '@/components/ui';
import type { UserListItem } from '../admin.service';
import type { User } from '@/features/auth/auth.types';

interface UserEditModalProps {
  user: UserListItem;
  onClose: () => void;
  onSave: (userId: string, updates: { name: string; email: string; role: User['role'] }) => void;
}

export function UserEditModal({ user, onClose, onSave }: UserEditModalProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }

    onSave(user.id, { name, email, role });
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title="Edit User">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg">
            <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3.5 py-2 text-[13px] text-slate-900 dark:text-slate-100 focus:border-primary-300 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3.5 py-2 text-[13px] text-slate-900 dark:text-slate-100 focus:border-primary-300 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as User['role'])}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3.5 py-2 text-[13px] text-slate-900 dark:text-slate-100 focus:border-primary-300 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10"
            >
              <option value="sales_rep">Sales Representative</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 inline-flex items-center justify-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-[13px] hover:bg-primary-700 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-[13px] text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
    </Modal>
  );
}
