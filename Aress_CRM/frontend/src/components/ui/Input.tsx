import { cn } from '@/utils/cn';
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-[13px] font-medium text-slate-600">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-700 placeholder-slate-300 transition-all duration-150 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/10 hover:border-slate-300',
          error && 'border-red-200 focus:border-red-300 focus:ring-red-500/10',
          className
        )}
        {...props}
      />
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-[13px] font-medium text-slate-600">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-700 transition-all duration-150 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/10 hover:border-slate-300',
          error && 'border-red-200 focus:border-red-300 focus:ring-red-500/10',
          className
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-[13px] font-medium text-slate-600">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-700 placeholder-slate-300 transition-all duration-150 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/10 hover:border-slate-300 resize-none',
          error && 'border-red-200 focus:border-red-300 focus:ring-red-500/10',
          className
        )}
        rows={3}
        {...props}
      />
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
