import React from 'react';
import { Calendar, Sprout, ShieldCheck, Clock, Bookmark, ArrowRight } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const PrebookingPipelineCard = ({ harvest, onPrebook }) => {
  const { t } = useTranslation();

  if (!harvest) return null;

  const totalQty = Number(harvest.expectedQuantity || harvest.quantity) || 10;
  const bookedQty = Number(harvest.bookedQuantity || harvest.reservedQuantity) || 0;
  const remainingQty = Math.max(0, totalQty - bookedQty);
  const percentBooked = Math.min(100, Math.round((bookedQty / totalQty) * 100));

  const daysToHarvest = Math.max(
    0, 
    Math.ceil((new Date(harvest.expectedHarvestDate || harvest.harvestDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
      
      {/* Top Section */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-bark dark:text-warm-white">
                {harvest.cropName || harvest.name}
              </h3>
              <span className="text-xs text-earth dark:text-sand/70">
                {harvest.variety || 'Native Variety'}
              </span>
            </div>
          </div>

          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-olive/15 text-olive dark:text-sage">
            {daysToHarvest === 0 ? 'Harvesting Today' : `Harvest in ${daysToHarvest}d`}
          </span>
        </div>

        {/* Harvest Date & Grower */}
        <div className="flex items-center justify-between text-xs text-earth dark:text-sand/70 pt-1">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-terracotta" />
            {new Date(harvest.expectedHarvestDate || harvest.harvestDate).toLocaleDateString()}
          </span>
          <span>
            {harvest.grower?.name || harvest.user?.name || 'Local Backyard Grower'}
          </span>
        </div>

        {/* Prebooking Allocation Meter */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-earth dark:text-sand/70">Reserved Capacity:</span>
            <span className="font-mono font-semibold text-bark dark:text-warm-white">
              {bookedQty} / {totalQty} {harvest.unit || 'kg'} ({percentBooked}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-sand/30 dark:bg-sand/15 rounded-full overflow-hidden">
            <div 
              className="h-full bg-olive dark:bg-sage rounded-full transition-all duration-500"
              style={{ width: `${percentBooked}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-earth/80 dark:text-sand/60">
            <span>Remaining to reserve:</span>
            <strong className="text-olive dark:text-sage font-mono">
              {remainingQty} {harvest.unit || 'kg'} available
            </strong>
          </div>
        </div>

        {/* Prebook Price / Condition */}
        {harvest.estimatedPrice && (
          <div className="p-2.5 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/30 text-xs flex items-center justify-between">
            <span className="text-earth dark:text-sand/70">Pre-order Fair Price:</span>
            <span className="font-serif font-bold text-olive dark:text-sage">
              ₹{harvest.estimatedPrice} / {harvest.unit || 'kg'}
            </span>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="pt-2">
        <button
          onClick={() => onPrebook?.(harvest)}
          disabled={remainingQty <= 0}
          className="w-full py-2.5 px-4 bg-olive hover:bg-olive/90 disabled:opacity-50 text-warm-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Bookmark className="w-4 h-4" />
          {remainingQty <= 0 ? t('harvest.allReserved', 'Fully Reserved') : t('harvest.prebookPortion', 'Pre-Book Harvest Portion')}
        </button>
      </div>

    </div>
  );
};

export default PrebookingPipelineCard;
