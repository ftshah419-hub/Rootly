import React from 'react';

export const Pagination = ({
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 15,
  onPageChange,
  className = ''
}) => {
  if (totalPages <= 1 && total <= limit) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-[#FFFDF8] dark:bg-[#33372E] border-t border-[#E9D8B9]/60 dark:border-stone-700/60 text-xs text-[#795640] dark:text-[#A5AD91] ${className}`}>
      <div className="font-medium">
        Showing <span className="font-bold text-[#282B24] dark:text-[#F7F0E3]">{total > 0 ? startRecord : 0}</span> to{' '}
        <span className="font-bold text-[#282B24] dark:text-[#F7F0E3]">{endRecord}</span> of{' '}
        <span className="font-bold text-[#282B24] dark:text-[#F7F0E3]">{total}</span> records
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous Page"
          className="p-1.5 rounded-lg border border-[#E9D8B9] dark:border-stone-700 hover:bg-[#F7F0E3] dark:hover:bg-[#282B24] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined !text-base">chevron_left</span>
        </button>

        <span className="px-3 py-1 font-semibold rounded-lg bg-[#3E5035]/10 dark:bg-[#adc29f]/20 text-[#3E5035] dark:text-[#adc29f]">
          {page} / {Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next Page"
          className="p-1.5 rounded-lg border border-[#E9D8B9] dark:border-stone-700 hover:bg-[#F7F0E3] dark:hover:bg-[#282B24] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="material-symbols-outlined !text-base">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
