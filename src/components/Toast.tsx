import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, Sparkles } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'points' | 'info' | 'success';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts }) => {
  return (
    <div
      id="playrush-toast-container"
      className="fixed bottom-24 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 space-y-2"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            id={`toast-${toast.id}`}
            className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1E2330]/95 backdrop-blur-md border border-white/10 text-white text-sm font-semibold shadow-xl shadow-black/40"
          >
            {toast.type === 'points' ? (
              <span className="text-amber-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </span>
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <Info className="w-4 h-4 text-blue-400" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
