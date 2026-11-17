import React from 'react';

export const LoadingSpinner = ({ size = 'md', text = '', color = 'olive' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    olive: 'text-olive-700 dark:text-sand',
    white: 'text-white',
    terracotta: 'text-terracotta'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          fill="currentColor"
        />
      </svg>
      {text && (
        <p className="text-xs sm:text-sm font-medium text-earth dark:text-cream/80">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
