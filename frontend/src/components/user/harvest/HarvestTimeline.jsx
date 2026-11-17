import React, { useState } from 'react';
import { Calendar, Sprout, Sun, CloudRain, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const HarvestTimeline = ({ harvests = [], onSelectHarvest }) => {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState('14'); // 7, 14, 30 days

  // Calculate days remaining helper
  const getDaysRemaining = (expectedDate) => {
    if (!expectedDate) return 0;
    const diff = new Date(expectedDate).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand/40 dark:border-sand/15 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive dark:text-sage flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-xl font-serif font-bold text-bark dark:text-warm-white">
              {t('harvest.timelineTitle', '14-Day Hyperlocal Harvest Radar')}
            </h3>
          </div>
          <p className="text-xs text-earth dark:text-sand/70 mt-1">
            {t('harvest.timelineSubtitle', 'Track upcoming ripening crops across neighbouring home plots and terrace gardens')}
          </p>
        </div>

        {/* Range switcher */}
        <div className="flex bg-sand/30 dark:bg-sand/10 p-1 rounded-xl text-xs font-medium self-start">
          {[
            { id: '7', label: 'Next 7 Days' },
            { id: '14', label: '14 Days' },
            { id: '30', label: 'This Month' }
          ].map((rng) => (
            <button
              key={rng.id}
              onClick={() => setSelectedRange(rng.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedRange === rng.id
                  ? 'bg-warm-white dark:bg-darkcard text-bark dark:text-warm-white shadow-sm font-semibold'
                  : 'text-earth dark:text-sand'
              }`}
            >
              {rng.label}
            </button>
          ))}
        </div>
      </div>

      {/* Harvest Cards Stream */}
      {harvests.length === 0 ? (
        <div className="text-center py-10 px-4 bg-cream/30 dark:bg-bark/20 rounded-2xl border border-dashed border-sand dark:border-sand/20 space-y-3">
          <Sprout className="w-10 h-10 text-olive/40 mx-auto" />
          <h4 className="text-sm font-serif font-semibold text-bark dark:text-warm-white">
            {t('harvest.noUpcoming', 'No Upcoming Harvests Logged in Selected Window')}
          </h4>
          <p className="text-xs text-earth dark:text-sand/70 max-w-sm mx-auto">
            {t('harvest.noUpcomingDesc', 'Be the first to announce an upcoming crop! Sowing dates, estimated yields, and prebooking windows help neighbours coordinate early.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {harvests.map((h) => {
            const daysLeft = getDaysRemaining(h.expectedHarvestDate || h.harvestDate);
            const grower = h.grower || h.user || {};

            return (
              <div
                key={h._id || h.id}
                onClick={() => onSelectHarvest?.(h)}
                className="group p-4 bg-cream/40 dark:bg-bark/30 hover:bg-cream/80 dark:hover:bg-bark/50 border border-sand/40 dark:border-sand/15 rounded-xl cursor-pointer transition-all hover:shadow-md space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-olive/15 text-olive dark:text-sage flex items-center justify-center font-bold text-xs">
                      <Sprout className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-bark dark:text-warm-white group-hover:text-olive dark:group-hover:text-sage transition-colors">
                        {h.cropName || h.plantName || h.name}
                      </h4>
                      <span className="text-[11px] text-earth dark:text-sand/70">
                        {h.variety || 'Native Heirloom'}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    daysLeft <= 3 
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' 
                      : 'bg-olive/10 text-olive dark:text-sage'
                  }`}>
                    {daysLeft === 0 ? 'Today!' : `${daysLeft} days left`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-earth dark:text-sand/80 pt-2 border-t border-sand/30 dark:border-sand/10">
                  <span>
                    Expected: <strong className="text-bark dark:text-warm-white">{h.expectedQuantity || h.quantity} {h.unit || 'kg'}</strong>
                  </span>
                  {h.allowPrebooking && (
                    <span className="text-olive dark:text-sage font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Pre-bookable
                    </span>
                  )}
                </div>

                {grower.name && (
                  <div className="text-[11px] text-earth/80 dark:text-sand/60">
                    Grower: {grower.name} {h.location?.address ? `• ${h.location.address}` : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Agro Weather & Season Indicator */}
      <div className="p-3 bg-sand/20 dark:bg-sand/5 rounded-xl border border-sand/40 dark:border-sand/10 flex flex-wrap items-center justify-between gap-3 text-xs text-earth dark:text-sand/80">
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Regional Agro Condition: Optimal sunshine hours for leafy greens & solanaceous vegetables</span>
        </div>
        <span className="font-mono text-[11px] font-semibold text-olive dark:text-sage">
          Mid-Season Kerala Sowing Window
        </span>
      </div>

    </div>
  );
};

export default HarvestTimeline;
