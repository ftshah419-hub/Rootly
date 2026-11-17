import React, { useEffect } from 'react';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';

export const DetailDrawer = ({
  isOpen,
  title,
  subtitle,
  children,
  footer,
  onClose,
  width = 'max-w-xl'
}) => {
  const { t } = useAdminLanguage();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={`w-screen ${width} bg-[#FFFDF8] dark:bg-[#33372E] border-l border-[#E9D8B9] dark:border-stone-700 rustic-shadow-3 flex flex-col justify-between animate-slide-in-right`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E9D8B9]/60 dark:border-stone-700/60 flex items-center justify-between bg-[#F7F0E3]/60 dark:bg-[#282B24]/50">
            <div>
              <h3 className="font-serif-brand text-xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('close')}
              className="p-1.5 rounded-full text-[#795640] dark:text-[#A5AD91] hover:bg-[#E9D8B9]/60 dark:hover:bg-stone-700 transition-colors"
            >
              <span className="material-symbols-outlined !text-xl leading-none">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 admin-scrollbar space-y-6">
            {children}
          </div>

          {/* Footer (if provided) */}
          {footer && (
            <div className="p-4 px-6 border-t border-[#E9D8B9]/60 dark:border-stone-700/60 bg-[#F7F0E3]/40 dark:bg-[#282B24]/40 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailDrawer;
