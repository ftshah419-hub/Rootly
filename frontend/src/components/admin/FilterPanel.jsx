import React from 'react';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';

export const FilterPanel = ({
  filters = [],
  onFilterChange,
  onReset,
  hasActiveFilters = false,
  className = ''
}) => {
  const { t } = useAdminLanguage();

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {filters.map((filter) => (
        <div key={filter.id} className="flex items-center gap-1.5">
          {filter.label && (
            <label htmlFor={`filter-${filter.id}`} className="text-xs font-semibold text-[#795640] dark:text-[#A5AD91]">
              {filter.label}:
            </label>
          )}
          <select
            id={`filter-${filter.id}`}
            value={filter.value}
            onChange={(e) => onFilterChange(filter.id, e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9] dark:border-stone-700 text-xs font-medium text-[#282B24] dark:text-[#F7F0E3] focus:outline-none focus:ring-1 focus:ring-[#3E5035]"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      {hasActiveFilters && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#C8754D] hover:bg-[#C8754D]/10 transition-colors"
        >
          <span className="material-symbols-outlined !text-sm">restart_alt</span>
          <span>{t('clearFilters')}</span>
        </button>
      )}
    </div>
  );
};

export default FilterPanel;
