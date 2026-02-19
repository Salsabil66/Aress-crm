import { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle className="w-[18px] h-[18px] text-emerald-500" />,
    error: <AlertCircle className="w-[18px] h-[18px] text-red-500" />,
    info: <Info className="w-[18px] h-[18px] text-blue-500" />,
  };

  const accentColors = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    info: 'border-l-blue-500',
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 bg-white rounded-lg shadow-lg shadow-slate-900/5 border border-slate-100 border-l-[3px] px-4 py-3 min-w-[320px] max-w-[400px] transition-all duration-300',
        accentColors[toast.type],
        isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
      )}
    >
      <span className="shrink-0">{icons[toast.type]}</span>
      <p className="flex-1 text-[13px] text-slate-600">{toast.message}</p>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        className="shrink-0 p-1 text-slate-300 hover:text-slate-500 rounded transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
