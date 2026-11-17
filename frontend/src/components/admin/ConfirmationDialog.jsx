import React, { useState, useEffect } from 'react';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';

export const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmVariant = 'danger', // danger, warning, primary
  requireReason = false,
  reasonPlaceholder,
  isLoading = false,
  onConfirm,
  onClose
}) => {
  const { t } = useAdminLanguage();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (requireReason && !reason.trim()) {
      setError(t('reasonRequired'));
      return;
    }
    onConfirm(reason.trim());
  };

  const confirmBtnClasses = {
    danger: 'bg-rose-700 hover:bg-rose-800 text-white',
    warning: 'bg-[#C8754D] hover:bg-[#924b26] text-white',
    primary: 'bg-[#3E5035] hover:bg-[#283920] text-white'
  }[confirmVariant] || 'bg-[#3E5035] text-white';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="w-full max-w-md p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9] dark:border-stone-700 rustic-shadow-3 animate-slide-in-up">
        <h3
          id="dialog-title"
          className="font-serif-brand text-xl font-bold text-[#282B24] dark:text-[#F7F0E3] mb-2"
        >
          {title || t('confirm')}
        </h3>
        <p className="text-sm text-[#795640] dark:text-[#A5AD91] mb-4 leading-relaxed">
          {message}
        </p>

        <form onSubmit={handleSubmit}>
          {requireReason && (
            <div className="mb-4">
              <label
                htmlFor="confirmation-reason"
                className="block text-xs font-semibold text-[#795640] dark:text-[#A5AD91] mb-1.5"
              >
                {t('reasonRequired')} <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="confirmation-reason"
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder={reasonPlaceholder || t('reasonPlaceholder')}
                className="w-full p-2.5 rounded-xl bg-[#F7F0E3]/50 dark:bg-[#282B24] border border-[#E9D8B9] dark:border-stone-700 text-xs text-[#282B24] dark:text-[#F7F0E3] focus:ring-2 focus:ring-[#3E5035] focus:outline-none"
                required
              />
              {error && <span className="text-xs text-rose-600 mt-1 block">{error}</span>}
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-[#E9D8B9]/60 dark:border-stone-700/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl border border-[#E9D8B9] dark:border-stone-700 text-xs font-semibold text-[#795640] dark:text-[#A5AD91] hover:bg-[#F7F0E3] dark:hover:bg-[#282B24] transition-colors"
            >
              {cancelLabel || t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${confirmBtnClasses} disabled:opacity-50`}
            >
              {isLoading && (
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              <span>{confirmLabel || t('confirm')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
