import React from 'react';
import { useTranslation } from '../../../hooks/user/useTranslation.js';

export const ProduceFilterDrawer = ({
  radiusKm = 5,
  onRadiusChange,
  exchangeType = '',
  onExchangeTypeChange,
  selectedCategory = '',
  onCategoryChange,
  pesticideFreeOnly = false,
  onPesticideFreeChange,
  maxPrice = 500,
  onMaxPriceChange,
  onResetFilters,
  categories = []
}) => {
  const { t } = useTranslation();

  return (
    <aside className="w-full flex flex-col gap-6 p-5 sm:p-6 rounded-3xl bg-cream-card dark:bg-darkcard border border-sand dark:border-darkborder shadow-warm">
      {/* Filter Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sand/60 dark:border-darkborder">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎚️</span>
          <h2 className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand">
            Refine Harvests
          </h2>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-bold text-terracotta hover:underline"
        >
          {t('actions.resetAll', 'Reset All')}
        </button>
      </div>

      {/* Radius Distance Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-bark dark:text-cream">
            Walk / Cycle Radius
          </span>
          <span className="text-xs font-bold text-terracotta">
            Within {radiusKm} km
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          step="0.5"
          value={radiusKm}
          onChange={(e) => onRadiusChange && onRadiusChange(parseFloat(e.target.value))}
          className="w-full accent-olive-700 cursor-pointer h-2 bg-sand/50 dark:bg-darkborder rounded-lg"
        />
        <div className="flex justify-between text-[10px] text-earth/70 dark:text-cream/60 font-medium">
          <span>1 km (Walk)</span>
          <span>5 km</span>
          <span>10 km (Cycle)</span>
        </div>
      </div>

      {/* Transaction Mode */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold text-bark dark:text-cream">
          Transaction Mode
        </span>
        <div className="flex flex-col gap-2 text-xs">
          <label className="flex items-center gap-2.5 p-2 rounded-xl bg-cream dark:bg-darkbg hover:bg-cream-hover transition cursor-pointer">
            <input
              type="radio"
              name="exchangeFilter"
              checked={exchangeType === ''}
              onChange={() => onExchangeTypeChange('')}
              className="accent-olive-700"
            />
            <span className="font-medium text-bark dark:text-cream">All Modes</span>
          </label>
          <label className="flex items-center gap-2.5 p-2 rounded-xl bg-cream dark:bg-darkbg hover:bg-cream-hover transition cursor-pointer">
            <input
              type="radio"
              name="exchangeFilter"
              checked={exchangeType === 'SELL'}
              onChange={() => onExchangeTypeChange('SELL')}
              className="accent-olive-700"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-olive-800 dark:text-sand">Direct Buy (Cash/UPI)</span>
              <span className="text-[10px] text-earth dark:text-cream/60">Fair neighborhood pricing</span>
            </div>
          </label>
          <label className="flex items-center gap-2.5 p-2 rounded-xl bg-cream dark:bg-darkbg hover:bg-cream-hover transition cursor-pointer">
            <input
              type="radio"
              name="exchangeFilter"
              checked={exchangeType === 'BARTER'}
              onChange={() => onExchangeTypeChange('BARTER')}
              className="accent-olive-700"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-terracotta">Barter Preferred</span>
              <span className="text-[10px] text-earth dark:text-cream/60">Trade for eggs, seeds, manure</span>
            </div>
          </label>
          <label className="flex items-center gap-2.5 p-2 rounded-xl bg-cream dark:bg-darkbg hover:bg-cream-hover transition cursor-pointer">
            <input
              type="radio"
              name="exchangeFilter"
              checked={exchangeType === 'FREE'}
              onChange={() => onExchangeTypeChange('FREE')}
              className="accent-olive-700"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-sage">Free Community Gift</span>
              <span className="text-[10px] text-earth dark:text-cream/60">Zero-cost neighbor surplus</span>
            </div>
          </label>
        </div>
      </div>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-bark dark:text-cream">
            Produce Categories
          </span>
          <div className="flex flex-col gap-1 text-xs">
            <button
              type="button"
              onClick={() => onCategoryChange('')}
              className={`p-2 rounded-xl text-left font-medium transition ${
                selectedCategory === ''
                  ? 'bg-olive-700 text-cream font-bold'
                  : 'hover:bg-cream dark:hover:bg-darkbg text-bark dark:text-cream'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id || cat.slug}
                type="button"
                onClick={() => onCategoryChange(cat._id || cat.slug)}
                className={`p-2 rounded-xl text-left font-medium transition flex items-center justify-between ${
                  selectedCategory === (cat._id || cat.slug)
                    ? 'bg-olive-700 text-cream font-bold'
                    : 'hover:bg-cream dark:hover:bg-darkbg text-bark dark:text-cream'
                }`}
              >
                <span>{cat.name}</span>
                {cat.icon && <span>{cat.icon}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Growing Practices */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-bark dark:text-cream">
          Farming & Trust Filters
        </span>
        <label className="flex items-center gap-2 text-xs text-bark dark:text-cream cursor-pointer p-1">
          <input
            type="checkbox"
            checked={pesticideFreeOnly}
            onChange={(e) => onPesticideFreeChange && onPesticideFreeChange(e.target.checked)}
            className="w-4 h-4 rounded accent-olive-700"
          />
          <span>100% Pesticide-Free (Verified)</span>
        </label>
      </div>

      {/* Max Price Slider */}
      <div className="flex flex-col gap-2 pt-2 border-t border-sand/50 dark:border-darkborder">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-bark dark:text-cream">Max Price</span>
          <span className="font-bold text-olive-800 dark:text-sand">₹{maxPrice}</span>
        </div>
        <input
          type="range"
          min="20"
          max="1000"
          step="10"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange && onMaxPriceChange(parseInt(e.target.value, 10))}
          className="w-full accent-olive-700 cursor-pointer h-2 bg-sand/50 dark:bg-darkborder rounded-lg"
        />
      </div>
    </aside>
  );
};

export default ProduceFilterDrawer;
