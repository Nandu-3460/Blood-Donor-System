import React from 'react';
import { AlertTriangle, Flame, ShieldAlert } from 'lucide-react';

export default function UrgencyBadge({ urgency }) {
  const level = urgency || 'Normal';

  const config = {
    Normal: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: AlertTriangle,
    },
    Urgent: {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      icon: Flame,
    },
    Emergency: {
      bg: 'bg-blood-100 text-blood-700 border-blood-300 animate-pulse',
      icon: ShieldAlert,
    },
  };

  const style = config[level] || config.Normal;
  const Icon = style.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${style.bg}`}
    >
      <Icon className="w-3 h-3" />
      {level}
    </span>
  );
}
