import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '~/lib/utils';

export type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastRef = useRef<{ msg: string; time: number }>({ msg: '', time: 0 });

  const remove = (id: string) => setToasts((t) => t.filter((toast) => toast.id !== id));

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const now = Date.now();
    if (message === lastRef.current.msg && now - lastRef.current.time < 1500) {
      return;
    }
    lastRef.current = { msg: message, time: now };
    const id = uuidv4();
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => remove(id), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50 flex flex-col items-end">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'px-4 py-2 rounded shadow text-white',
                toast.variant === 'success' && 'bg-green-600',
                toast.variant === 'error' && 'bg-red-600',
                toast.variant === 'info' && 'bg-gray-800'
              )}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}