import React from 'react';

export const MapPopup = ({ item, onSelect }) => {
  if (!item) return null;

  const isHarvest = item.expectedHarvestDate !== undefined;
  const badgeColor =
    item.exchangeType === 'BARTER'
      ? 'bg-terracotta text-white'
      : item.exchangeType === 'FREE'
      ? 'bg-sage text-bark'
      : isHarvest
      ? 'bg-amber-600 text-white'
      : 'bg-olive-700 text-white';

  return (
    <div className="p-2 min-w-[200px] max-w-[240px]">
      {item.images?.[0]?.url && (
        <img
          src={item.images[0].url}
          alt={item.name}
          className="w-full h-24 object-cover rounded-xl mb-2"
        />
      )}
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {isHarvest ? 'UPCOMING HARVEST' : item.exchangeType || 'SELL'}
        </span>
        {item.pricing?.price > 0 && (
          <span className="text-xs font-bold text-olive-800 dark:text-sand">
            ₹{item.pricing.price} / {item.pricing.unit}
          </span>
        )}
      </div>

      <h5 className="font-serif-brand font-bold text-base text-olive-900 dark:text-cream leading-tight mb-1">
        {item.name || item.produceName}
      </h5>

      <p className="text-[11px] text-earth dark:text-cream/70 line-clamp-2 mb-2">
        {item.description || item.notes || 'Homegrown fresh harvest.'}
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-sand/60 dark:border-darkborder text-[10px] text-earth/70 dark:text-cream/60">
        <span>📍 {item.location?.neighborhood || 'Neighborhood Garden'}</span>
        {onSelect && (
          <button
            type="button"
            onClick={() => onSelect(item)}
            className="font-semibold text-terracotta hover:underline ml-2"
          >
            Details →
          </button>
        )}
      </div>
    </div>
  );
};

export default MapPopup;
