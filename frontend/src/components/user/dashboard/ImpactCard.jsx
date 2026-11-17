import React from 'react';
import { Award, Leaf, Globe2, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';

const ImpactCard = ({ impact = {} }) => {
  const { t } = useTranslation();

  const totalKg = impact.totalProduceKg ?? 12.5;
  const foodMiles = impact.foodMilesSaved ?? Math.round(totalKg * 42); // avg 42km saved per kg compared to truck transit
  const co2Offset = impact.co2OffsetKg ?? (totalKg * 1.8).toFixed(1);
  const plasticSaved = impact.plasticWrappersAvoided ?? Math.round(totalKg * 3.5);

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-sand/40 dark:border-sand/15 pb-4">
        <div className="w-8 h-8 rounded-lg bg-olive/10 text-olive dark:text-sage flex items-center justify-center font-bold">
          <Globe2 className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
            {t('impact.title', 'Hyperlocal Ecological & Community Impact')}
          </h3>
          <p className="text-xs text-earth dark:text-sand/70">
            {t('impact.subtitle', 'Environmental emissions avoided by trading garden surplus within your 5km radius')}
          </p>
        </div>
      </div>

      {/* Metrics 4-Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/15 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-earth/80 dark:text-sand/70 block">
            {t('impact.produceShared', 'Produce Shared')}
          </span>
          <div className="text-xl font-serif font-bold text-olive dark:text-sage">
            {totalKg} kg
          </div>
          <span className="text-[10px] text-earth/70 dark:text-sand/60 block">Organic Surplus</span>
        </div>

        <div className="p-3.5 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/15 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-earth/80 dark:text-sand/70 block">
            {t('impact.foodMiles', 'Food Miles Cut')}
          </span>
          <div className="text-xl font-serif font-bold text-terracotta">
            ~{foodMiles} km
          </div>
          <span className="text-[10px] text-earth/70 dark:text-sand/60 block">Supply Chain Bypass</span>
        </div>

        <div className="p-3.5 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/15 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-earth/80 dark:text-sand/70 block">
            {t('impact.co2Offset', 'Carbon Offset')}
          </span>
          <div className="text-xl font-serif font-bold text-olive dark:text-sage">
            {co2Offset} kg
          </div>
          <span className="text-[10px] text-earth/70 dark:text-sand/60 block">CO2 Equivalent</span>
        </div>

        <div className="p-3.5 bg-cream/40 dark:bg-bark/30 rounded-xl border border-sand/40 dark:border-sand/15 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-earth/80 dark:text-sand/70 block">
            {t('impact.plasticAvoided', 'Single-Use Plastic')}
          </span>
          <div className="text-xl font-serif font-bold text-earth dark:text-sand">
            {plasticSaved}
          </div>
          <span className="text-[10px] text-earth/70 dark:text-sand/60 block">Packages Avoided</span>
        </div>
      </div>

      {/* Community Badges */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-semibold text-bark dark:text-warm-white block">
          Earned Community Steward Badges:
        </span>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-olive/10 text-olive dark:text-sage border border-olive/20 text-xs font-medium">
            <Leaf className="w-3.5 h-3.5" />
            Zero-Mile Backyarder
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20 text-xs font-medium">
            <HeartHandshake className="w-3.5 h-3.5" />
            Generous Neighbour
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand/30 dark:bg-sand/10 text-earth dark:text-sand border border-sand/40 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-olive" />
            Verified Porch Host
          </div>
        </div>
      </div>

    </div>
  );
};

export default ImpactCard;
