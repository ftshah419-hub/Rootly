import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../../hooks/user/useTranslation.js';

export const ProduceCard = ({ product, onQuickView }) => {
  const { t } = useTranslation();

  if (!product) return null;

  const {
    _id,
    name,
    description,
    exchangeType = 'SELL',
    price = 0,
    unit = 'kg',
    quantity = {},
    images = [],
    sellerId = {},
    location = {},
    growingPractices = {},
    freshnessInfo = {}
  } = product;

  const primaryImage = images?.[0]?.url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtjSRO4HzW_djH3idb500UOBjQjFr0rL2bruDO1poV8cNgHFe1BB-xlX66-4mVneF5s_SsH5wfh0ANsYRXEgrNTGDVIHHIufav7RUQAoirZIMhqnSDeBDS_dk5bDzcw24wv_h81VgRA2a8ad565xd9E-8ZE0fmJan2o6Axc508gcPnpCC2Sg-MfKArfe4kkEhIQTWc99ehq0bg92SaMX5mkz-s_zUGXrthLc4krFD2';
  const sellerName = sellerId?.name || 'Local Neighbor';
  const gardenName = sellerId?.profile?.gardenName || 'Backyard Garden';
  const sellerInitial = (sellerName[0] || 'L').toUpperCase();

  const getExchangeTypeBadge = () => {
    switch (exchangeType) {
      case 'BARTER':
        return {
          label: t('exchangeTypes.barter', 'Barter Ready'),
          className: 'bg-terracotta text-white font-bold'
        };
      case 'FREE':
        return {
          label: t('exchangeTypes.free', 'Community Gift'),
          className: 'bg-sage text-darkbg font-bold'
        };
      case 'SELL':
      default:
        return {
          label: t('exchangeTypes.sell', 'Direct Buy'),
          className: 'bg-olive-700 text-cream font-bold'
        };
    }
  };

  const badge = getExchangeTypeBadge();

  return (
    <article className="rustic-card group rounded-2xl bg-cream-card dark:bg-darkcard border border-sand/70 dark:border-darkborder overflow-hidden shadow-xs hover:shadow-warm flex flex-col justify-between">
      {/* Visual Header */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand/30 dark:bg-darkbg/40">
        <img
          src={primaryImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtjSRO4HzW_djH3idb500UOBjQjFr0rL2bruDO1poV8cNgHFe1BB-xlX66-4mVneF5s_SsH5wfh0ANsYRXEgrNTGDVIHHIufav7RUQAoirZIMhqnSDeBDS_dk5bDzcw24wv_h81VgRA2a8ad565xd9E-8ZE0fmJan2o6Axc508gcPnpCC2Sg-MfKArfe4kkEhIQTWc99ehq0bg92SaMX5mkz-s_zUGXrthLc4krFD2';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase shadow-xs ${badge.className}`}>
            {badge.label}
          </span>
          {growingPractices?.pesticideFree && (
            <span className="px-2 py-0.5 rounded-full bg-cream-card/90 dark:bg-darkcard/90 backdrop-blur-sm text-olive-800 dark:text-sand text-[10px] font-bold shadow-xs">
              Pesticide-Free
            </span>
          )}
        </div>

        {/* Bottom Distance & Qty */}
        <div className="absolute bottom-2.5 right-2.5 bg-cream-card/90 dark:bg-darkcard/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-medium text-bark dark:text-cream shadow-xs">
          <span>📍</span>
          <span>{location?.distanceKm ? `${location.distanceKm} km` : 'Near you'}</span>
        </div>
      </div>

      {/* Body Information */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <Link to={`/products/${_id}`}>
              <h3 className="font-serif-brand text-lg font-bold text-olive-900 dark:text-sand hover:text-terracotta transition-colors leading-snug line-clamp-1">
                {name}
              </h3>
            </Link>
          </div>

          <p className="text-xs text-earth dark:text-cream/70 line-clamp-2 leading-relaxed mb-2">
            {description}
          </p>

          {/* Pricing / Exchange info */}
          <div className="flex items-baseline justify-between pt-1">
            <div>
              {exchangeType === 'FREE' ? (
                <span className="font-serif-brand text-xl font-bold text-olive-700 dark:text-sand">
                  FREE / ₹0
                </span>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="font-serif-brand text-xl font-bold text-olive-800 dark:text-sand">
                    ₹{price}
                  </span>
                  <span className="text-xs text-earth/70 dark:text-cream/60">
                    / {unit}
                  </span>
                </div>
              )}
            </div>

            <span className="text-[11px] text-earth dark:text-cream/60 font-medium">
              {quantity?.available !== undefined ? `${quantity.available} ${unit} left` : 'Fresh batch'}
            </span>
          </div>
        </div>

        {/* Footer: Grower info & Action button */}
        <div className="pt-3 border-t border-sand/50 dark:border-darkborder/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-sand font-bold text-xs flex items-center justify-center shrink-0">
              {sellerInitial}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-semibold text-bark dark:text-cream truncate leading-tight">
                {sellerName}
              </span>
              <span className="text-[10px] text-earth/70 dark:text-cream/60 truncate leading-none">
                {gardenName}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onQuickView ? onQuickView(product) : null}
            className="px-3 py-1.5 rounded-xl bg-olive-700 hover:bg-olive-800 text-cream text-xs font-semibold transition shadow-2xs shrink-0"
          >
            {t('actions.viewTrade', 'View & Trade')}
          </button>
        </div>
      </div>
    </article>
  );
};

export const ProduceCardSkeleton = () => (
  <div className="rounded-2xl bg-cream-card dark:bg-darkcard border border-sand/60 dark:border-darkborder overflow-hidden p-4 flex flex-col gap-3">
    <div className="aspect-[4/3] rounded-xl shimmer-skeleton w-full"></div>
    <div className="h-5 shimmer-skeleton rounded-md w-3/4"></div>
    <div className="h-3.5 shimmer-skeleton rounded-md w-full"></div>
    <div className="h-3.5 shimmer-skeleton rounded-md w-1/2"></div>
    <div className="pt-3 border-t border-sand/40 dark:border-darkborder flex items-center justify-between">
      <div className="w-24 h-4 shimmer-skeleton rounded-md"></div>
      <div className="w-16 h-7 shimmer-skeleton rounded-lg"></div>
    </div>
  </div>
);

export default ProduceCard;
