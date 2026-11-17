import React from 'react';

export const StatsCard = ({
  icon,
  title,
  value,
  subtitle,
  accent = 'olive',
  trend,
  className = ''
}) => {
  // Theme accents
  const accentClasses = {
    olive: 'bg-[#3E5035]/10 text-[#3E5035] dark:bg-[#adc29f]/20 dark:text-[#adc29f]',
    terracotta: 'bg-[#C8754D]/15 text-[#C8754D] dark:bg-[#ffa276]/20 dark:text-[#ffa276]',
    sage: 'bg-[#A5AD91]/25 text-[#3E5035] dark:bg-[#A5AD91]/20 dark:text-[#A5AD91]',
    amber: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-300',
    blue: 'bg-sky-100 text-sky-900 dark:bg-sky-950/50 dark:text-sky-300'
  }[accent] || 'bg-[#3E5035]/10 text-[#3E5035]';

  return (
    <div
      className={`p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9]/70 dark:border-stone-700/60 rustic-shadow-1 hover:border-[#3E5035]/40 transition-all ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl ${accentClasses} flex items-center justify-center shrink-0`}>
          <span className="material-symbols-outlined !text-xl" aria-hidden="true">
            {icon}
          </span>
        </div>
        {trend && (
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
              trend.isPositive !== false
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            <span className="material-symbols-outlined !text-xs leading-none">
              {trend.isPositive !== false ? 'trending_up' : 'trending_down'}
            </span>
            <span>{trend.label}</span>
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <span className="font-serif-brand text-2xl sm:text-3xl font-bold tracking-tight text-[#282B24] dark:text-[#F7F0E3]">
          {value !== undefined && value !== null ? value : '—'}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#795640] dark:text-[#A5AD91] mt-1 truncate">
          {title}
        </span>
        {subtitle && (
          <span className="text-[11px] text-[#795640]/70 dark:text-[#A5AD91]/70 mt-0.5 truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
