import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        let bgColor = 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900';
        let icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;

        if (toast.type === 'success') {
          bgColor = 'bg-emerald-950/90 border border-emerald-600/50 text-emerald-100 backdrop-blur-md shadow-lg shadow-emerald-950/20';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          bgColor = 'bg-rose-950/90 border border-rose-600/50 text-rose-100 backdrop-blur-md shadow-lg shadow-rose-950/20';
          icon = <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          bgColor = 'bg-amber-950/90 border border-amber-600/50 text-amber-100 backdrop-blur-md shadow-lg shadow-amber-950/20';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else {
          bgColor = 'bg-sky-950/90 border border-sky-600/50 text-sky-100 backdrop-blur-md shadow-lg shadow-sky-950/20';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-xl transition-all duration-300 transform translate-y-0 ${bgColor}`}
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              {icon}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4 opacity-70 hover:opacity-100" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
