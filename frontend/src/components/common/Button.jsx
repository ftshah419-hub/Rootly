import React from 'react';
import LoadingSpinner from './LoadingSpinner.jsx';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  icon = null,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variantClasses = {
    primary:
      'bg-olive-700 hover:bg-olive-800 text-cream focus:ring-olive-600 shadow-md hover:shadow-lg',
    secondary:
      'border border-sand dark:border-darkborder bg-white dark:bg-darkcard text-bark dark:text-cream hover:bg-cream dark:hover:bg-darkbg shadow-xs focus:ring-sand',
    terracotta:
      'bg-terracotta hover:bg-terracotta-hover text-white focus:ring-terracotta shadow-md hover:shadow-lg',
    danger:
      'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md',
    ghost:
      'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-bark dark:text-cream focus:ring-olive-700'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner size="sm" color={variant === 'secondary' ? 'olive' : 'white'} />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
