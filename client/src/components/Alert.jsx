import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function Alert({ type = 'error', message, onClose }) {
  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-red-50 text-red-800 border-red-200',
      icon: AlertCircle,
    },
    success: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle,
    },
    info: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: Info,
    },
    warning: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: AlertCircle,
    },
  };

  const current = styles[type] || styles.error;
  const Icon = current.icon;

  return (
    <div
      className={`p-4 rounded-lg border flex items-start justify-between gap-3 ${current.bg} text-sm mb-4 transition-all`}
      role="alert"
    >
      <div className="flex items-start gap-2.5">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span className="font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 transition p-0.5 rounded"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
