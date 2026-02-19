import { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../AuthContext';
import type { RegisterData } from '../auth.types';

export function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!name.trim()) { setError('Name is required'); return; }
      if (!email.trim()) { setError('Email is required'); return; }
      if (email === 'admin@gmail.com') { setError('Cannot register with admin email'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
      const result = await register({ name, email, password });
      if (!result.success) setError(result.error || 'Registration failed');
    } else {
      if (!email.trim()) { setError('Email is required'); return; }
      if (!password.trim()) { setError('Password is required'); return; }
      const result = await login({ email, password });
      if (!result.success) setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-6">
      
      {/* Card with subtle gradient border */}
      <div className="w-full max-w-md p-[1px] rounded-2xl 
                      bg-gradient-to-b from-slate-200 to-slate-300
                      dark:from-slate-800 dark:to-slate-700">
        
        {/* Card */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-xl">
          
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
              aress
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>

          <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-2 mb-7">
            {isRegister
              ? 'Start managing your sales pipeline today'
              : 'Sign in to your CRM account'}
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-lg border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20">
              <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700
                               bg-white dark:bg-slate-800 text-[13px]
                               focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700
                             bg-white dark:bg-slate-800 text-[13px]
                             focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-700
                             bg-white dark:bg-slate-800 text-[13px]
                             focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary-600 text-white text-[14px]
                         font-semibold hover:bg-primary-700 transition shadow-sm"
            >
              {isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-[13px] text-primary-600 hover:text-primary-700 font-medium"
            >
              {isRegister
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}