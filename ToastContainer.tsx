import React from 'react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-slide-up ${
            toast.type === 'error'
              ? 'bg-[#ba1a1a]/95 text-white border-red-400/40'
              : toast.type === 'info'
              ? 'bg-[#1b1c1c]/95 text-white border-white/10'
              : 'bg-[#1b1c1c]/95 text-white border-white/10'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#e9e2d7]">
              {toast.type === 'error' ? 'error' : toast.type === 'info' ? 'info' : 'check_circle'}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/60 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
