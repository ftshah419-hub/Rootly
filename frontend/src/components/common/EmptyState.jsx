import React from 'react';
import Button from './Button.jsx';

export const EmptyState = ({
  icon,
  title = 'No items found',
  description = 'There are no records to display at this time.',
  actionText,
  onAction,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-dashed border-sand dark:border-darkborder bg-cream-card/50 dark:bg-darkcard/40 ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-sand/40 dark:bg-darkborder/60 flex items-center justify-center text-olive-700 dark:text-sand mb-4 text-2xl">
        {icon || '🌱'}
      </div>
      <h4 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand mb-1.5">
        {title}
      </h4>
      <p className="text-xs sm:text-sm text-earth dark:text-cream/70 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
