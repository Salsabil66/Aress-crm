import { ProfileSettings, StatusSettings } from '../components';

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Settings</h1>
        <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-1">Manage your account and CRM configuration</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ProfileSettings />
        <StatusSettings />
      </div>
    </div>
  );
}
