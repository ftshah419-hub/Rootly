import React from 'react';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';

export const EmptyState = ({
  icon = 'inbox',
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  const { t } = useAdminLanguage();

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9]/60 dark:border-stone-700/60 rustic-shadow-1 ${className}`}
      role="region"
      aria-label="No data available"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F7F0E3] dark:bg-[#282B24] border border-[#E9D8B9] dark:border-stone-700 text-[#3E5035] dark:text-[#adc29f] flex items-center justify-center mb-4 shadow-sm">
        <span className="material-symbols-outlined !text-3xl" aria-hidden="true">
          {icon}
        </span>
      </div>
      <h3 className="font-serif-brand text-xl font-bold text-[#282B24] dark:text-[#F7F0E3] mb-2">
        {title || t('noDataFound')}
      </h3>
      <p className="text-sm text-[#795640] dark:text-[#A5AD91] max-w-md mx-auto mb-6 leading-relaxed">
        {description || t('noDataDescription')}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3E5035] text-[#FFFDF8] hover:bg-[#283920] text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <span className="material-symbols-outlined !text-base" aria-hidden="true">
            refresh
          </span>
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default EmptyState;
