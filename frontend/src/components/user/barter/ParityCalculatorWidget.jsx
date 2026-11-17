import React, { useState, useEffect } from 'react';
import { Scale, Sparkles, ArrowRight, RefreshCw, Info } from 'lucide-react';
import { useTranslation } from '../../../hooks/user/useTranslation';
import { barterService } from '../../../services/user/barterService';

const ParityCalculatorWidget = () => {
  const { t } = useTranslation();
  const [offeredCrop, setOfferedCrop] = useState('Tapioca');
  const [offeredQty, setOfferedQty] = useState(2);
  const [desiredCrop, setDesiredCrop] = useState('Country Eggs');
  const [desiredQty, setDesiredQty] = useState(6);
  const [result, setResult] = useState(null);

  const cropSuggestions = [
    'Tapioca', 'Country Eggs', 'Nendran Bananas', 'Green Chilies', 
    'Curry Leaves', 'Coconuts', 'Moringa / Drumsticks', 'Organic Tomatoes', 
    'Backyard Ginger', 'Lemongrass', 'Wild Honey', 'Red Amaranth Spinach'
  ];

  useEffect(() => {
    const calc = barterService.calculateParityRatio(
      offeredCrop, 
      desiredCrop, 
      Number(offeredQty) || 1, 
      Number(desiredQty) || 1
    );
    setResult(calc);
  }, [offeredCrop, offeredQty, desiredCrop, desiredQty]);

  return (
    <div className="bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/20 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-sand/40 dark:border-sand/15 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-bark dark:text-warm-white">
              {t('barter.calculatorTitle', 'Harvest Parity Calculator')}
            </h3>
            <p className="text-xs text-earth dark:text-sand/70">
              {t('barter.calculatorSubtitle', 'Heuristic balance index based on regional agro-yield effort and seasonality')}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sand/30 dark:bg-sand/10 text-earth dark:text-sand font-semibold">
          AI Heuristics v2.1
        </span>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Offered */}
        <div className="bg-cream/40 dark:bg-bark/30 p-4 rounded-xl border border-sand/40 dark:border-sand/10 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-earth/80 dark:text-sand/70 block">
            {t('barter.yourCrop', 'Your Garden Surplus')}
          </label>
          <div className="space-y-2">
            <input
              type="text"
              list="offered-crops"
              value={offeredCrop}
              onChange={(e) => setOfferedCrop(e.target.value)}
              placeholder="e.g. Tapioca, Bananas"
              className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
            <datalist id="offered-crops">
              {cropSuggestions.map(c => <option key={c} value={c} />)}
            </datalist>
            <div className="flex items-center gap-2">
              <span className="text-xs text-earth dark:text-sand/70">{t('common.quantity', 'Quantity')}:</span>
              <input
                type="number"
                min="0.25"
                step="0.5"
                value={offeredQty}
                onChange={(e) => setOfferedQty(Math.max(0.1, Number(e.target.value) || 1))}
                className="w-24 text-sm text-center font-bold bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-lg py-1 text-bark dark:text-warm-white"
              />
            </div>
          </div>
        </div>

        {/* Desired */}
        <div className="bg-cream/40 dark:bg-bark/30 p-4 rounded-xl border border-sand/40 dark:border-sand/10 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-earth/80 dark:text-sand/70 block">
            {t('barter.desiredCrop', 'Produce You Want in Return')}
          </label>
          <div className="space-y-2">
            <input
              type="text"
              list="desired-crops"
              value={desiredCrop}
              onChange={(e) => setDesiredCrop(e.target.value)}
              placeholder="e.g. Honey, Eggs, Tomatoes"
              className="w-full text-sm bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-xl p-2.5 text-bark dark:text-warm-white focus:outline-none focus:ring-1 focus:ring-terracotta"
            />
            <datalist id="desired-crops">
              {cropSuggestions.map(c => <option key={c} value={c} />)}
            </datalist>
            <div className="flex items-center gap-2">
              <span className="text-xs text-earth dark:text-sand/70">{t('common.quantity', 'Quantity')}:</span>
              <input
                type="number"
                min="0.25"
                step="0.5"
                value={desiredQty}
                onChange={(e) => setDesiredQty(Math.max(0.1, Number(e.target.value) || 1))}
                className="w-24 text-sm text-center font-bold bg-warm-white dark:bg-darkcard border border-sand dark:border-sand/30 rounded-lg py-1 text-bark dark:text-warm-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Banner */}
      {result && (
        <div className="p-4 bg-terracotta/10 dark:bg-terracotta/15 rounded-xl border border-terracotta/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-terracotta" />
              <span className="text-xs font-bold uppercase tracking-wider text-terracotta">
                {t('barter.parityAssessment', 'Parity Assessment')}
              </span>
            </div>
            <p className="text-sm font-semibold text-bark dark:text-warm-white">
              {result.fairness}
            </p>
            <p className="text-xs text-earth dark:text-sand/80">
              Exchange Ratio Index: <span className="font-mono font-bold text-terracotta">{result.ratio}</span>
            </p>
          </div>

          <div className="text-center sm:text-right bg-warm-white/80 dark:bg-darkcard/80 px-4 py-2 rounded-xl border border-sand/40">
            <span className="text-[10px] text-earth dark:text-sand/70 block uppercase font-mono">Suggested Equivalency</span>
            <span className="text-xs font-serif font-bold text-bark dark:text-warm-white">
              {offeredQty} of {offeredCrop} ≈ {result.recommendedQty || desiredQty} of {desiredCrop}
            </span>
          </div>
        </div>
      )}

      {/* Philosophy note */}
      <div className="flex items-start gap-2 text-xs text-earth dark:text-sand/70">
        <Info className="w-4 h-4 text-olive shrink-0 mt-0.5" />
        <span>
          {t('barter.covenantText', 'The Golden Rule of Hyperlocal Barter: Non-commercial trades thrive on neighbourly goodwill, not rigid price parity. A surplus shared freely builds true community resilience.')}
        </span>
      </div>

    </div>
  );
};

export default ParityCalculatorWidget;
