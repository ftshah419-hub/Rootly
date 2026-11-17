import React, { useState, useEffect } from 'react';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';

export const SearchInput = ({
  value = '',
  onChange,
  onSearch,
  placeholder,
  debounceMs = 300,
  className = ''
}) => {
  const { t } = useAdminLanguage();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (onChange) {
      const handler = setTimeout(() => {
        if (localValue !== value) {
          onChange(localValue);
        }
      }, debounceMs);
      return () => clearTimeout(handler);
    }
  }, [localValue, debounceMs, onChange, value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      e.preventDefault();
      onSearch(localValue);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    if (onChange) onChange('');
    if (onSearch) onSearch('');
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <span
        className="material-symbols-outlined absolute left-3 text-[#795640]/70 dark:text-[#A5AD91]/70 !text-lg pointer-events-none"
        aria-hidden="true"
      >
        search
      </span>
      <input
        type="search"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || t('searchPlaceholder')}
        className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9] dark:border-stone-700 text-xs text-[#282B24] dark:text-[#F7F0E3] placeholder-[#795640]/50 dark:placeholder-[#A5AD91]/50 focus:outline-none focus:ring-2 focus:ring-[#3E5035] focus:border-transparent transition-all shadow-inner"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          className="absolute right-2.5 p-0.5 rounded-full text-[#795640]/60 hover:text-[#795640] dark:text-[#A5AD91]/60 dark:hover:text-[#A5AD91] hover:bg-[#F7F0E3] dark:hover:bg-[#282B24]"
        >
          <span className="material-symbols-outlined !text-sm leading-none">close</span>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
