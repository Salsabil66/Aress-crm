import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ToastData } from '@/components/ui/Toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((type: ToastData['type'], message: string) => {
    const id = uuidv4();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}
