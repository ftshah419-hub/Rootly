import React from 'react';

export const MapControls = ({
  radiusKm = 5,
  onRadiusChange,
  exchangeFilter = 'ALL',
  onExchangeFilterChange,
  onLocateMe,
  isLocating = false
}) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-[400] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
      {/* Filters pill */}
      <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded-2xl bg-cream-card/95 dark:bg-darkcard/95 backdrop-blur-md border border-sand dark:border-darkborder shadow-warm">
        {['ALL', 'SELL', 'BARTER', 'FREE'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onExchangeFilterChange?.(type)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              exchangeFilter === type
                ? 'bg-olive-700 text-white shadow-xs'
                : 'text-bark/80 dark:text-cream/80 hover:bg-cream dark:hover:bg-darkbg'
            }`}
          >
            {type === 'ALL' ? 'All Produce' : type}
          </button>
        ))}
      </div>

      {/* Right controls: Radius & Geolocation */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Radius selector */}
        {onRadiusChange && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-cream-card/95 dark:bg-darkcard/95 backdrop-blur-md border border-sand dark:border-darkborder shadow-warm text-xs font-medium text-bark dark:text-cream">
            <span className="text-earth dark:text-sage">Radius:</span>
            <select
              value={radiusKm}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="bg-transparent font-bold text-olive-800 dark:text-sand border-none focus:ring-0 p-0 text-xs cursor-pointer"
            >
              <option value={1}>1 km</option>
              <option value={2}>2 km</option>
              <option value={3}>3 km</option>
              <option value={5}>5 km</option>
            </select>
          </div>
        )}

        {/* Locate me button */}
        {onLocateMe && (
          <button
            type="button"
            onClick={onLocateMe}
            disabled={isLocating}
            title="Locate my position"
            className="p-2.5 rounded-2xl bg-cream-card/95 dark:bg-darkcard/95 backdrop-blur-md border border-sand dark:border-darkborder shadow-warm text-olive-800 dark:text-sand hover:bg-cream dark:hover:bg-darkbg transition flex items-center justify-center disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default MapControls;
