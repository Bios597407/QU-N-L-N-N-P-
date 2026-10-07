import React from 'react';
import { appState } from '../services/appStateService';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const toasts = appState.toasts;

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-3 md:right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarn = toast.type === 'warn';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-xl border text-xs font-medium backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-2 ${
              isSuccess
                ? 'bg-slate-900/95 text-white border-emerald-500/50'
                : isWarn
                ? 'bg-amber-950/95 text-amber-100 border-amber-500/50'
                : isError
                ? 'bg-rose-950/95 text-rose-100 border-rose-500/50'
                : 'bg-slate-900/95 text-slate-100 border-blue-500/50'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isWarn && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {!isSuccess && !isWarn && !isError && <Info className="w-4 h-4 text-blue-400" />}
            </div>

            <div className="flex-1 leading-relaxed text-slate-100">{toast.message}</div>

            <button
              onClick={() => appState.dismissToast(toast.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-white rounded-lg transition"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
