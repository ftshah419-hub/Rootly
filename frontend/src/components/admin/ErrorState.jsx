import React from 'react';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';

export const ErrorState = ({ message, onRetry, className = '' }) => {
  const { t } = useAdminLanguage();

  return (
    <div
      className={`p-6 sm:p-8 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-center ${className}`}
      role="alert"
    >
      <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 flex items-center justify-center mx-auto mb-3">
        <span className="material-symbols-outlined !text-2xl" aria-hidden="true">
          warning
        </span>
      </div>
      <h4 className="font-bold text-base text-rose-900 dark:text-rose-200 mb-1">
        {t('errorOccurred')}
      </h4>
      <p className="text-xs text-rose-700 dark:text-rose-400 max-w-md mx-auto mb-4 font-mono break-words">
        {message || 'Unable to complete request.'}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined !text-sm" aria-hidden="true">
            refresh
          </span>
          <span>{t('retry')}</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
