import React from 'react';
import ProduceCard, { ProduceCardSkeleton } from './ProduceCard.jsx';
import EmptyState from '../../common/EmptyState.jsx';
import { useTranslation } from '../../../hooks/user/useTranslation.js';

export const ProduceGrid = ({
  products = [],
  isLoading = false,
  onQuickView,
  onResetFilters,
  emptyTitle,
  emptyDescription
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProduceCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon="🌱"
        title={emptyTitle || t('empty.noProductsTitle', 'No Harvests Found')}
        description={
          emptyDescription ||
          t(
            'empty.noProductsDesc',
            'No produce currently matches your filter radius. Be the first neighbour to list today’s fresh harvest!'
          )
        }
        actionText={onResetFilters ? t('actions.resetAll', 'Reset Filters') : undefined}
        onAction={onResetFilters}
        className="py-16"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProduceCard
          key={product._id}
          product={product}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
};

export default ProduceGrid;
