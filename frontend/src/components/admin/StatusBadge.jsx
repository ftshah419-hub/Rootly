import React from 'react';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';

export const StatusBadge = ({ status, size = 'sm', className = '' }) => {
  const { t } = useAdminLanguage();

  if (!status) return null;

  const normalized = String(status).toUpperCase();

  // Status style mappings following Rustic Premium tokens
  let styleClasses = 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
  let icon = 'info';

  switch (normalized) {
    case 'ACTIVE':
    case 'AVAILABLE':
    case 'APPROVED':
    case 'COMPLETED':
    case 'SUCCESS':
    case 'READY_NOW':
    case 'HARVESTED':
      styleClasses = 'bg-[#3E5035]/10 text-[#3E5035] border-[#3E5035]/30 dark:bg-[#adc29f]/20 dark:text-[#adc29f] dark:border-[#adc29f]/30';
      icon = 'check_circle';
      break;

    case 'PENDING':
    case 'SUBMITTED':
    case 'UNDER_REVIEW':
    case 'INVESTIGATING':
    case 'RESERVED':
    case 'SCHEDULED':
    case 'GROWING':
    case 'NEAR_HARVEST':
      styleClasses = 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      icon = 'hourglass_top';
      break;

    case 'SUSPENDED':
    case 'BLOCKED':
    case 'DEACTIVATED':
    case 'REJECTED':
    case 'CANCELLED':
    case 'OUT_OF_STOCK':
    case 'ERROR':
    case 'RATE_LIMITED':
      styleClasses = 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      icon = 'cancel';
      break;

    case 'DISMISSED':
    case 'FALLBACK':
      styleClasses = 'bg-stone-100 text-stone-600 border-stone-300 dark:bg-stone-800 dark:text-stone-400 dark:border-stone-700';
      icon = 'remove_circle_outline';
      break;

    default:
      styleClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800';
      icon = 'fiber_manual_record';
      break;
  }

  const sizeClasses = size === 'xs'
    ? 'text-[11px] px-2 py-0.5 gap-1'
    : size === 'md'
    ? 'text-sm px-3 py-1 gap-1.5'
    : 'text-xs px-2.5 py-0.5 gap-1';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${styleClasses} ${sizeClasses} ${className} transition-colors`}
      role="status"
    >
      <span className="material-symbols-outlined !text-[13px] leading-none shrink-0" aria-hidden="true">
        {icon}
      </span>
      <span>{t(normalized, normalized)}</span>
    </span>
  );
};

export default StatusBadge;
