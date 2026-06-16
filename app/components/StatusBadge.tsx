'use client';

import React from 'react';

export default function StatusBadge({ status }: { status: string }) {
  // Normalize the status string to uppercase to avoid casing bugs between tables
  const normalizedStatus = (status || '').toUpperCase();

  // Map out every state used across your system: Clinical, Operational, and Supply Chain
  const styles: Record<string, string> = {
    // Clinical / Appointments / Billing Statuses
    'PENDING': 'bg-amber-50 text-amber-700 border border-amber-200/60',
    'COMPLETED': 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    'CANCELLED': 'bg-rose-50 text-rose-700 border border-rose-200/60',
    'DRAFT': 'bg-slate-100 text-slate-600 border border-slate-200',
    'PAID': 'bg-cyan-50 text-cyan-700 border border-cyan-200/60',

    // Vendor / Supplier Statuses
    'ACTIVE': 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    'REVIEW': 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    'INACTIVE': 'bg-slate-100 text-slate-500 border border-slate-200',

    // Inventory Flags
    'AVAILABLE': 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    'LOW STOCK': 'bg-red-50 text-red-700 border border-red-200/60 animate-pulse',
  };

  // Safe fallback if an unexpected status string flows through
  const currentStyle = styles[normalizedStatus] || 'bg-gray-50 text-gray-600 border border-gray-200';

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        px-3 py-1
        rounded-full
        text-xs
        font-bold
        tracking-wide
        transition-all
        duration-200
        ${currentStyle}
      `}
    >
      {status}
    </span>
  );
}