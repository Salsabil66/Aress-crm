import { useState } from 'react';
import { Save, User, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/features/auth';

export function ProfileSettings() {
  const { user, updateProfile, updatePassword } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  
  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    if (!name.trim() || !email.trim()) {
      setError('Name and email are required');
      return;
    }
    updateProfile({ name, email }).then((result) => {
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.error || 'Failed to update');
      }
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSaved(false);
    
    if (!currentPassword.trim()) {
      setPasswordError('Current password is required');
      return;
    }
    if (!newPassword.trim()) {
      setPasswordError('New password is required');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    updatePassword({ currentPassword, newPassword }).then((result) => {
      if (result.success) {
        setPasswordSaved(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSaved(false), 3000);
      } else {
        setPasswordError(result.error || 'Failed to update password');
      }
    });
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin':
        return { label: 'Administrator', color: 'bg-red-50 text-red-600' };
      case 'manager':
        return { label: 'Manager', color: 'bg-blue-50 text-blue-600' };
      case 'sales_rep':
        return { label: 'Sales Representative', color: 'bg-emerald-50 text-emerald-600' };
      default:
        return { label: 'User', color: 'bg-slate-50 text-slate-600' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">Profile Settings</h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Update your account details and security</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-100 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 px-5 py-3 text-[13px] font-medium transition-all duration-150 border-b-2 ${
            activeTab === 'profile'
              ? 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400'
              : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex-1 px-5 py-3 text-[13px] font-medium transition-all duration-150 border-b-2 ${
            activeTab === 'password'
              ? 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400'
              : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          Change Password
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-600">
            <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white text-base font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-slate-700 dark:text-slate-200">{user?.name}</p>
              <p className="text-[12px] text-slate-400 dark:text-slate-400">{user?.email}</p>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${roleBadge.color}`}>
                  {roleBadge.label}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg">
              <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {saved && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-lg">
              <p className="text-[12px] text-emerald-600 dark:text-emerald-400">Profile updated successfully!</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3.5 py-2 text-[13px] text-slate-900 dark:text-slate-100 focus:border-primary-300 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-150"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3.5 py-2 text-[13px] text-slate-900 dark:text-slate-100 focus:border-primary-300 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-150"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400">Role</label>
            <input
              type="text"
              value={roleBadge.label}
              disabled
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 px-3.5 py-2 text-[13px] text-slate-400 dark:text-slate-500 cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-300 dark:text-slate-600">Contact an admin to change your role</p>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-[13px] hover:bg-primary-700 transition-all duration-150 cursor-pointer active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSubmit} className="p-5 space-y-4">
          {passwordError && (
            <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-lg">
              <p className="text-[12px] text-red-600 dark:text-red-400">{passwordError}</p>
            </div>
          )}

          {passwordSaved && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-lg">
              <p className="text-[12px] text-emerald-600 dark:text-emerald-400">Password updated successfully!</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3.5 py-2 pr-10 text-[13px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-300 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3.5 py-2 pr-10 text-[13px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-300 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Password must be at least 6 characters</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-slate-600 dark:text-slate-400">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3.5 py-2 pr-10 text-[13px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-300 dark:focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/10 hover:border-slate-300 dark:hover:border-slate-500 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-[13px] hover:bg-primary-700 transition-all duration-150 cursor-pointer active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              Update Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
