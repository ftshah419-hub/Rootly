import React from 'react';

export const LoadingSkeleton = ({ rows = 5, type = 'table', className = '' }) => {
  if (type === 'cards') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse ${className}`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9]/60 dark:border-stone-700/60"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-stone-200 dark:bg-stone-700"></div>
              <div className="w-16 h-4 rounded bg-stone-200 dark:bg-stone-700"></div>
            </div>
            <div className="w-24 h-7 rounded bg-stone-200 dark:bg-stone-700 mb-2"></div>
            <div className="w-32 h-3.5 rounded bg-stone-200 dark:bg-stone-700"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`p-6 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9]/60 dark:border-stone-700/60 animate-pulse ${className}`}>
        <div className="w-48 h-5 rounded bg-stone-200 dark:bg-stone-700 mb-6"></div>
        <div className="h-56 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-end gap-3 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-stone-200 dark:bg-stone-700"
              style={{ height: `${20 + (i * 11) % 70}%` }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Default: table skeleton
  return (
    <div className={`rounded-2xl overflow-hidden border border-[#E9D8B9]/60 dark:border-stone-700/60 bg-[#FFFDF8] dark:bg-[#33372E] animate-pulse ${className}`}>
      <div className="p-4 border-b border-[#E9D8B9]/40 dark:border-stone-700/40 bg-[#F7F0E3]/50 dark:bg-[#282B24]/40 flex gap-4">
        <div className="w-1/4 h-4 rounded bg-stone-200 dark:bg-stone-700"></div>
        <div className="w-1/4 h-4 rounded bg-stone-200 dark:bg-stone-700"></div>
        <div className="w-1/4 h-4 rounded bg-stone-200 dark:bg-stone-700"></div>
        <div className="w-1/4 h-4 rounded bg-stone-200 dark:bg-stone-700"></div>
      </div>
      <div className="divide-y divide-stone-100 dark:divide-stone-800">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between gap-4">
            <div className="w-1/3 h-4 rounded bg-stone-200 dark:bg-stone-700"></div>
            <div className="w-1/4 h-4 rounded bg-stone-200 dark:bg-stone-700"></div>
            <div className="w-1/6 h-5 rounded-full bg-stone-200 dark:bg-stone-700"></div>
            <div className="w-16 h-7 rounded-lg bg-stone-200 dark:bg-stone-700"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
