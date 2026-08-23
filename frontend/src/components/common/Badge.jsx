import React from 'react';
import { Droplet, AlertCircle, CheckCircle2, Clock, XCircle, ShieldCheck } from 'lucide-react';

export function BloodGroupBadge({ group, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-black rounded-xl bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 border border-red-200/80 dark:border-red-900/50 shadow-sm ${sizes[size]} ${className}`}
    >
      <span>{group}</span>
    </div>
  );
}

export function StatusBadge({ status, urgency, className = '' }) {
  // If urgency is passed
  if (urgency) {
    const uMap = {
      CRITICAL: { label: 'CRITICAL', bg: 'bg-red-500 text-white shadow-red-500/20 animate-pulse', icon: AlertCircle },
      URGENT: { label: 'URGENT', bg: 'bg-amber-500 text-white shadow-amber-500/20', icon: Clock },
      NORMAL: { label: 'NORMAL', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: CheckCircle2 },
    };
    const item = uMap[urgency?.toUpperCase()] || uMap.NORMAL;
    const Icon = item.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm ${item.bg} ${className}`}>
        <Icon className="w-3.5 h-3.5" />
        {item.label}
      </span>
    );
  }

  // Request status
  const sMap = {
    PENDING: { label: 'PENDING', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40', icon: Clock },
    ACCEPTED: { label: 'ACCEPTED', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40', icon: CheckCircle2 },
    REJECTED: { label: 'REJECTED', bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40', icon: XCircle },
    COMPLETED: { label: 'COMPLETED', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40', icon: ShieldCheck },
  };

  const item = sMap[status?.toUpperCase()] || { label: status, bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: Clock };
  const Icon = item.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.bg} ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {item.label}
    </span>
  );
}

export function AvailabilityBadge({ available, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
        available
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
      } ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${available ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
      {available ? 'Available Now' : 'Unavailable'}
    </span>
  );
}
