import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const normalized = status || 'Pending';

  const config = {
    Pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
    },
    Accepted: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
    Completed: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: CheckCircle2,
    },
    Declined: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
    },
    Cancelled: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: AlertCircle,
    },
  };

  const style = config[normalized] || config.Pending;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.bg}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {normalized}
    </span>
  );
}
